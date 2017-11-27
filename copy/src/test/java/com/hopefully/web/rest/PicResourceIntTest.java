package com.hopefully.web.rest;

import com.hopefully.HopefullyApp;

import com.hopefully.domain.Pic;
import com.hopefully.domain.Course;
import com.hopefully.repository.PicRepository;
import com.hopefully.repository.search.PicSearchRepository;
import com.hopefully.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.util.List;

import static com.hopefully.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PicResource REST controller.
 *
 * @see PicResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HopefullyApp.class)
public class PicResourceIntTest {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    @Autowired
    private PicRepository picRepository;

    @Autowired
    private PicSearchRepository picSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPicMockMvc;

    private Pic pic;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PicResource picResource = new PicResource(picRepository, picSearchRepository);
        this.restPicMockMvc = MockMvcBuilders.standaloneSetup(picResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pic createEntity(EntityManager em) {
        Pic pic = new Pic()
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        // Add required entity
        Course coursepic = CourseResourceIntTest.createEntity(em);
        em.persist(coursepic);
        em.flush();
        pic.setCoursepic(coursepic);
        return pic;
    }

    @Before
    public void initTest() {
        picSearchRepository.deleteAll();
        pic = createEntity(em);
    }

    @Test
    @Transactional
    public void createPic() throws Exception {
        int databaseSizeBeforeCreate = picRepository.findAll().size();

        // Create the Pic
        restPicMockMvc.perform(post("/api/pics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pic)))
            .andExpect(status().isCreated());

        // Validate the Pic in the database
        List<Pic> picList = picRepository.findAll();
        assertThat(picList).hasSize(databaseSizeBeforeCreate + 1);
        Pic testPic = picList.get(picList.size() - 1);
        assertThat(testPic.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testPic.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);

        // Validate the Pic in Elasticsearch
        Pic picEs = picSearchRepository.findOne(testPic.getId());
        assertThat(picEs).isEqualToComparingFieldByField(testPic);
    }

    @Test
    @Transactional
    public void createPicWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = picRepository.findAll().size();

        // Create the Pic with an existing ID
        pic.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPicMockMvc.perform(post("/api/pics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pic)))
            .andExpect(status().isBadRequest());

        // Validate the Pic in the database
        List<Pic> picList = picRepository.findAll();
        assertThat(picList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkImageIsRequired() throws Exception {
        int databaseSizeBeforeTest = picRepository.findAll().size();
        // set the field null
        pic.setImage(null);

        // Create the Pic, which fails.

        restPicMockMvc.perform(post("/api/pics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pic)))
            .andExpect(status().isBadRequest());

        List<Pic> picList = picRepository.findAll();
        assertThat(picList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPics() throws Exception {
        // Initialize the database
        picRepository.saveAndFlush(pic);

        // Get all the picList
        restPicMockMvc.perform(get("/api/pics?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pic.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void getPic() throws Exception {
        // Initialize the database
        picRepository.saveAndFlush(pic);

        // Get the pic
        restPicMockMvc.perform(get("/api/pics/{id}", pic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pic.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    public void getNonExistingPic() throws Exception {
        // Get the pic
        restPicMockMvc.perform(get("/api/pics/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePic() throws Exception {
        // Initialize the database
        picRepository.saveAndFlush(pic);
        picSearchRepository.save(pic);
        int databaseSizeBeforeUpdate = picRepository.findAll().size();

        // Update the pic
        Pic updatedPic = picRepository.findOne(pic.getId());
        updatedPic
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restPicMockMvc.perform(put("/api/pics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPic)))
            .andExpect(status().isOk());

        // Validate the Pic in the database
        List<Pic> picList = picRepository.findAll();
        assertThat(picList).hasSize(databaseSizeBeforeUpdate);
        Pic testPic = picList.get(picList.size() - 1);
        assertThat(testPic.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testPic.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);

        // Validate the Pic in Elasticsearch
        Pic picEs = picSearchRepository.findOne(testPic.getId());
        assertThat(picEs).isEqualToComparingFieldByField(testPic);
    }

    @Test
    @Transactional
    public void updateNonExistingPic() throws Exception {
        int databaseSizeBeforeUpdate = picRepository.findAll().size();

        // Create the Pic

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPicMockMvc.perform(put("/api/pics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pic)))
            .andExpect(status().isCreated());

        // Validate the Pic in the database
        List<Pic> picList = picRepository.findAll();
        assertThat(picList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePic() throws Exception {
        // Initialize the database
        picRepository.saveAndFlush(pic);
        picSearchRepository.save(pic);
        int databaseSizeBeforeDelete = picRepository.findAll().size();

        // Get the pic
        restPicMockMvc.perform(delete("/api/pics/{id}", pic.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean picExistsInEs = picSearchRepository.exists(pic.getId());
        assertThat(picExistsInEs).isFalse();

        // Validate the database is empty
        List<Pic> picList = picRepository.findAll();
        assertThat(picList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPic() throws Exception {
        // Initialize the database
        picRepository.saveAndFlush(pic);
        picSearchRepository.save(pic);

        // Search the pic
        restPicMockMvc.perform(get("/api/_search/pics?query=id:" + pic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pic.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pic.class);
        Pic pic1 = new Pic();
        pic1.setId(1L);
        Pic pic2 = new Pic();
        pic2.setId(pic1.getId());
        assertThat(pic1).isEqualTo(pic2);
        pic2.setId(2L);
        assertThat(pic1).isNotEqualTo(pic2);
        pic1.setId(null);
        assertThat(pic1).isNotEqualTo(pic2);
    }
}
