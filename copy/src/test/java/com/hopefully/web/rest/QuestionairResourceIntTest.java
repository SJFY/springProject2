package com.hopefully.web.rest;

import com.hopefully.HopefullyApp;

import com.hopefully.domain.Questionair;
import com.hopefully.repository.QuestionairRepository;
import com.hopefully.repository.search.QuestionairSearchRepository;
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
 * Test class for the QuestionairResource REST controller.
 *
 * @see QuestionairResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HopefullyApp.class)
public class QuestionairResourceIntTest {

    private static final String DEFAULT_VIEW = "AAAAAAAAAA";
    private static final String UPDATED_VIEW = "BBBBBBBBBB";

    @Autowired
    private QuestionairRepository questionairRepository;

    @Autowired
    private QuestionairSearchRepository questionairSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionairMockMvc;

    private Questionair questionair;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionairResource questionairResource = new QuestionairResource(questionairRepository, questionairSearchRepository);
        this.restQuestionairMockMvc = MockMvcBuilders.standaloneSetup(questionairResource)
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
    public static Questionair createEntity(EntityManager em) {
        Questionair questionair = new Questionair()
            .view(DEFAULT_VIEW);
        return questionair;
    }

    @Before
    public void initTest() {
        questionairSearchRepository.deleteAll();
        questionair = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionair() throws Exception {
        int databaseSizeBeforeCreate = questionairRepository.findAll().size();

        // Create the Questionair
        restQuestionairMockMvc.perform(post("/api/questionairs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionair)))
            .andExpect(status().isCreated());

        // Validate the Questionair in the database
        List<Questionair> questionairList = questionairRepository.findAll();
        assertThat(questionairList).hasSize(databaseSizeBeforeCreate + 1);
        Questionair testQuestionair = questionairList.get(questionairList.size() - 1);
        assertThat(testQuestionair.getView()).isEqualTo(DEFAULT_VIEW);

        // Validate the Questionair in Elasticsearch
        Questionair questionairEs = questionairSearchRepository.findOne(testQuestionair.getId());
        assertThat(questionairEs).isEqualToComparingFieldByField(testQuestionair);
    }

    @Test
    @Transactional
    public void createQuestionairWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionairRepository.findAll().size();

        // Create the Questionair with an existing ID
        questionair.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionairMockMvc.perform(post("/api/questionairs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionair)))
            .andExpect(status().isBadRequest());

        // Validate the Questionair in the database
        List<Questionair> questionairList = questionairRepository.findAll();
        assertThat(questionairList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkViewIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionairRepository.findAll().size();
        // set the field null
        questionair.setView(null);

        // Create the Questionair, which fails.

        restQuestionairMockMvc.perform(post("/api/questionairs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionair)))
            .andExpect(status().isBadRequest());

        List<Questionair> questionairList = questionairRepository.findAll();
        assertThat(questionairList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionairs() throws Exception {
        // Initialize the database
        questionairRepository.saveAndFlush(questionair);

        // Get all the questionairList
        restQuestionairMockMvc.perform(get("/api/questionairs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionair.getId().intValue())))
            .andExpect(jsonPath("$.[*].view").value(hasItem(DEFAULT_VIEW.toString())));
    }

    @Test
    @Transactional
    public void getQuestionair() throws Exception {
        // Initialize the database
        questionairRepository.saveAndFlush(questionair);

        // Get the questionair
        restQuestionairMockMvc.perform(get("/api/questionairs/{id}", questionair.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionair.getId().intValue()))
            .andExpect(jsonPath("$.view").value(DEFAULT_VIEW.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionair() throws Exception {
        // Get the questionair
        restQuestionairMockMvc.perform(get("/api/questionairs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionair() throws Exception {
        // Initialize the database
        questionairRepository.saveAndFlush(questionair);
        questionairSearchRepository.save(questionair);
        int databaseSizeBeforeUpdate = questionairRepository.findAll().size();

        // Update the questionair
        Questionair updatedQuestionair = questionairRepository.findOne(questionair.getId());
        updatedQuestionair
            .view(UPDATED_VIEW);

        restQuestionairMockMvc.perform(put("/api/questionairs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuestionair)))
            .andExpect(status().isOk());

        // Validate the Questionair in the database
        List<Questionair> questionairList = questionairRepository.findAll();
        assertThat(questionairList).hasSize(databaseSizeBeforeUpdate);
        Questionair testQuestionair = questionairList.get(questionairList.size() - 1);
        assertThat(testQuestionair.getView()).isEqualTo(UPDATED_VIEW);

        // Validate the Questionair in Elasticsearch
        Questionair questionairEs = questionairSearchRepository.findOne(testQuestionair.getId());
        assertThat(questionairEs).isEqualToComparingFieldByField(testQuestionair);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionair() throws Exception {
        int databaseSizeBeforeUpdate = questionairRepository.findAll().size();

        // Create the Questionair

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionairMockMvc.perform(put("/api/questionairs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionair)))
            .andExpect(status().isCreated());

        // Validate the Questionair in the database
        List<Questionair> questionairList = questionairRepository.findAll();
        assertThat(questionairList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionair() throws Exception {
        // Initialize the database
        questionairRepository.saveAndFlush(questionair);
        questionairSearchRepository.save(questionair);
        int databaseSizeBeforeDelete = questionairRepository.findAll().size();

        // Get the questionair
        restQuestionairMockMvc.perform(delete("/api/questionairs/{id}", questionair.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean questionairExistsInEs = questionairSearchRepository.exists(questionair.getId());
        assertThat(questionairExistsInEs).isFalse();

        // Validate the database is empty
        List<Questionair> questionairList = questionairRepository.findAll();
        assertThat(questionairList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchQuestionair() throws Exception {
        // Initialize the database
        questionairRepository.saveAndFlush(questionair);
        questionairSearchRepository.save(questionair);

        // Search the questionair
        restQuestionairMockMvc.perform(get("/api/_search/questionairs?query=id:" + questionair.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionair.getId().intValue())))
            .andExpect(jsonPath("$.[*].view").value(hasItem(DEFAULT_VIEW.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Questionair.class);
        Questionair questionair1 = new Questionair();
        questionair1.setId(1L);
        Questionair questionair2 = new Questionair();
        questionair2.setId(questionair1.getId());
        assertThat(questionair1).isEqualTo(questionair2);
        questionair2.setId(2L);
        assertThat(questionair1).isNotEqualTo(questionair2);
        questionair1.setId(null);
        assertThat(questionair1).isNotEqualTo(questionair2);
    }
}
