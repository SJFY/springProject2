package com.hopefully.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.hopefully.domain.Questionair;

import com.hopefully.repository.QuestionairRepository;
import com.hopefully.repository.search.QuestionairSearchRepository;
import com.hopefully.web.rest.errors.BadRequestAlertException;
import com.hopefully.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Questionair.
 */
@RestController
@RequestMapping("/api")
public class QuestionairResource {

    private final Logger log = LoggerFactory.getLogger(QuestionairResource.class);

    private static final String ENTITY_NAME = "questionair";

    private final QuestionairRepository questionairRepository;

    private final QuestionairSearchRepository questionairSearchRepository;

    public QuestionairResource(QuestionairRepository questionairRepository, QuestionairSearchRepository questionairSearchRepository) {
        this.questionairRepository = questionairRepository;
        this.questionairSearchRepository = questionairSearchRepository;
    }

    /**
     * POST  /questionairs : Create a new questionair.
     *
     * @param questionair the questionair to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionair, or with status 400 (Bad Request) if the questionair has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/questionairs")
    @Timed
    public ResponseEntity<Questionair> createQuestionair(@Valid @RequestBody Questionair questionair) throws URISyntaxException {
        log.debug("REST request to save Questionair : {}", questionair);
        if (questionair.getId() != null) {
            throw new BadRequestAlertException("A new questionair cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Questionair result = questionairRepository.save(questionair);
        questionairSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/questionairs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /questionairs : Updates an existing questionair.
     *
     * @param questionair the questionair to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionair,
     * or with status 400 (Bad Request) if the questionair is not valid,
     * or with status 500 (Internal Server Error) if the questionair couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/questionairs")
    @Timed
    public ResponseEntity<Questionair> updateQuestionair(@Valid @RequestBody Questionair questionair) throws URISyntaxException {
        log.debug("REST request to update Questionair : {}", questionair);
        if (questionair.getId() == null) {
            return createQuestionair(questionair);
        }
        Questionair result = questionairRepository.save(questionair);
        questionairSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionair.getId().toString()))
            .body(result);
    }

    /**
     * GET  /questionairs : get all the questionairs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionairs in body
     */
    @GetMapping("/questionairs")
    @Timed
    public List<Questionair> getAllQuestionairs() {
        log.debug("REST request to get all Questionairs");
        return questionairRepository.findAll();
        }

    /**
     * GET  /cuquestionairs/:id : get all the questionairs for a specific course.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionairs in body
     */
    @GetMapping("/cuquestionairs/{id}")
    @Timed
    public List<Questionair> getCuQuestionairs(@PathVariable Long id) {
        log.debug("REST request to get all Questionairs");
        return questionairRepository.findByCourseId(id);
    }

    /**
     * GET  /questionairs/:id : get the "id" questionair.
     *
     * @param id the id of the questionair to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionair, or with status 404 (Not Found)
     */
    @GetMapping("/questionairs/{id}")
    @Timed
    public ResponseEntity<Questionair> getQuestionair(@PathVariable Long id) {
        log.debug("REST request to get Questionair : {}", id);
        Questionair questionair = questionairRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionair));
    }

    /**
     * DELETE  /questionairs/:id : delete the "id" questionair.
     *
     * @param id the id of the questionair to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/questionairs/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionair(@PathVariable Long id) {
        log.debug("REST request to delete Questionair : {}", id);
        questionairRepository.delete(id);
        questionairSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/questionairs?query=:query : search for the questionair corresponding
     * to the query.
     *
     * @param query the query of the questionair search
     * @return the result of the search
     */
    @GetMapping("/_search/questionairs")
    @Timed
    public List<Questionair> searchQuestionairs(@RequestParam String query) {
        log.debug("REST request to search Questionairs for query {}", query);
        return StreamSupport
            .stream(questionairSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
