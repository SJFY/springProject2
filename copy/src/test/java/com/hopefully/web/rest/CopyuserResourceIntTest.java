package com.hopefully.web.rest;

import com.hopefully.HopefullyApp;

import com.hopefully.domain.Copyuser;
import com.hopefully.domain.User;
import com.hopefully.repository.CopyuserRepository;
import com.hopefully.repository.search.CopyuserSearchRepository;
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
 * Test class for the CopyuserResource REST controller.
 *
 * @see CopyuserResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HopefullyApp.class)
public class CopyuserResourceIntTest {

    private static final byte[] DEFAULT_AVATER = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_AVATER = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_AVATER_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_AVATER_CONTENT_TYPE = "image/png";

    @Autowired
    private CopyuserRepository copyuserRepository;

    @Autowired
    private CopyuserSearchRepository copyuserSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCopyuserMockMvc;

    private Copyuser copyuser;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CopyuserResource copyuserResource = new CopyuserResource(copyuserRepository, copyuserSearchRepository);
        this.restCopyuserMockMvc = MockMvcBuilders.standaloneSetup(copyuserResource)
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
    public static Copyuser createEntity(EntityManager em) {
        Copyuser copyuser = new Copyuser()
            .avater(DEFAULT_AVATER)
            .avaterContentType(DEFAULT_AVATER_CONTENT_TYPE);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        copyuser.setUser(user);
        return copyuser;
    }

    @Before
    public void initTest() {
        copyuserSearchRepository.deleteAll();
        copyuser = createEntity(em);
    }

    @Test
    @Transactional
    public void createCopyuser() throws Exception {
        int databaseSizeBeforeCreate = copyuserRepository.findAll().size();

        // Create the Copyuser
        restCopyuserMockMvc.perform(post("/api/copyusers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(copyuser)))
            .andExpect(status().isCreated());

        // Validate the Copyuser in the database
        List<Copyuser> copyuserList = copyuserRepository.findAll();
        assertThat(copyuserList).hasSize(databaseSizeBeforeCreate + 1);
        Copyuser testCopyuser = copyuserList.get(copyuserList.size() - 1);
        assertThat(testCopyuser.getAvater()).isEqualTo(DEFAULT_AVATER);
        assertThat(testCopyuser.getAvaterContentType()).isEqualTo(DEFAULT_AVATER_CONTENT_TYPE);

        // Validate the Copyuser in Elasticsearch
        Copyuser copyuserEs = copyuserSearchRepository.findOne(testCopyuser.getId());
        assertThat(copyuserEs).isEqualToComparingFieldByField(testCopyuser);
    }

    @Test
    @Transactional
    public void createCopyuserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = copyuserRepository.findAll().size();

        // Create the Copyuser with an existing ID
        copyuser.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCopyuserMockMvc.perform(post("/api/copyusers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(copyuser)))
            .andExpect(status().isBadRequest());

        // Validate the Copyuser in the database
        List<Copyuser> copyuserList = copyuserRepository.findAll();
        assertThat(copyuserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCopyusers() throws Exception {
        // Initialize the database
        copyuserRepository.saveAndFlush(copyuser);

        // Get all the copyuserList
        restCopyuserMockMvc.perform(get("/api/copyusers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(copyuser.getId().intValue())))
            .andExpect(jsonPath("$.[*].avaterContentType").value(hasItem(DEFAULT_AVATER_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].avater").value(hasItem(Base64Utils.encodeToString(DEFAULT_AVATER))));
    }

    @Test
    @Transactional
    public void getCopyuser() throws Exception {
        // Initialize the database
        copyuserRepository.saveAndFlush(copyuser);

        // Get the copyuser
        restCopyuserMockMvc.perform(get("/api/copyusers/{id}", copyuser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(copyuser.getId().intValue()))
            .andExpect(jsonPath("$.avaterContentType").value(DEFAULT_AVATER_CONTENT_TYPE))
            .andExpect(jsonPath("$.avater").value(Base64Utils.encodeToString(DEFAULT_AVATER)));
    }

    @Test
    @Transactional
    public void getNonExistingCopyuser() throws Exception {
        // Get the copyuser
        restCopyuserMockMvc.perform(get("/api/copyusers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCopyuser() throws Exception {
        // Initialize the database
        copyuserRepository.saveAndFlush(copyuser);
        copyuserSearchRepository.save(copyuser);
        int databaseSizeBeforeUpdate = copyuserRepository.findAll().size();

        // Update the copyuser
        Copyuser updatedCopyuser = copyuserRepository.findOne(copyuser.getId());
        updatedCopyuser
            .avater(UPDATED_AVATER)
            .avaterContentType(UPDATED_AVATER_CONTENT_TYPE);

        restCopyuserMockMvc.perform(put("/api/copyusers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCopyuser)))
            .andExpect(status().isOk());

        // Validate the Copyuser in the database
        List<Copyuser> copyuserList = copyuserRepository.findAll();
        assertThat(copyuserList).hasSize(databaseSizeBeforeUpdate);
        Copyuser testCopyuser = copyuserList.get(copyuserList.size() - 1);
        assertThat(testCopyuser.getAvater()).isEqualTo(UPDATED_AVATER);
        assertThat(testCopyuser.getAvaterContentType()).isEqualTo(UPDATED_AVATER_CONTENT_TYPE);

        // Validate the Copyuser in Elasticsearch
        Copyuser copyuserEs = copyuserSearchRepository.findOne(testCopyuser.getId());
        assertThat(copyuserEs).isEqualToComparingFieldByField(testCopyuser);
    }

    @Test
    @Transactional
    public void updateNonExistingCopyuser() throws Exception {
        int databaseSizeBeforeUpdate = copyuserRepository.findAll().size();

        // Create the Copyuser

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCopyuserMockMvc.perform(put("/api/copyusers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(copyuser)))
            .andExpect(status().isCreated());

        // Validate the Copyuser in the database
        List<Copyuser> copyuserList = copyuserRepository.findAll();
        assertThat(copyuserList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCopyuser() throws Exception {
        // Initialize the database
        copyuserRepository.saveAndFlush(copyuser);
        copyuserSearchRepository.save(copyuser);
        int databaseSizeBeforeDelete = copyuserRepository.findAll().size();

        // Get the copyuser
        restCopyuserMockMvc.perform(delete("/api/copyusers/{id}", copyuser.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean copyuserExistsInEs = copyuserSearchRepository.exists(copyuser.getId());
        assertThat(copyuserExistsInEs).isFalse();

        // Validate the database is empty
        List<Copyuser> copyuserList = copyuserRepository.findAll();
        assertThat(copyuserList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCopyuser() throws Exception {
        // Initialize the database
        copyuserRepository.saveAndFlush(copyuser);
        copyuserSearchRepository.save(copyuser);

        // Search the copyuser
        restCopyuserMockMvc.perform(get("/api/_search/copyusers?query=id:" + copyuser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(copyuser.getId().intValue())))
            .andExpect(jsonPath("$.[*].avaterContentType").value(hasItem(DEFAULT_AVATER_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].avater").value(hasItem(Base64Utils.encodeToString(DEFAULT_AVATER))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Copyuser.class);
        Copyuser copyuser1 = new Copyuser();
        copyuser1.setId(1L);
        Copyuser copyuser2 = new Copyuser();
        copyuser2.setId(copyuser1.getId());
        assertThat(copyuser1).isEqualTo(copyuser2);
        copyuser2.setId(2L);
        assertThat(copyuser1).isNotEqualTo(copyuser2);
        copyuser1.setId(null);
        assertThat(copyuser1).isNotEqualTo(copyuser2);
    }
}
