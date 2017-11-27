package com.hopefully.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.hopefully.domain.Pic;

import com.hopefully.repository.PicRepository;
import com.hopefully.repository.search.PicSearchRepository;
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
 * REST controller for managing Pic.
 */
@RestController
@RequestMapping("/api")
public class PicResource {

    private final Logger log = LoggerFactory.getLogger(PicResource.class);

    private static final String ENTITY_NAME = "pic";

    private final PicRepository picRepository;

    private final PicSearchRepository picSearchRepository;

    public PicResource(PicRepository picRepository, PicSearchRepository picSearchRepository) {
        this.picRepository = picRepository;
        this.picSearchRepository = picSearchRepository;
    }

    /**
     * POST  /pics : Create a new pic.
     *
     * @param pic the pic to create
     * @return the ResponseEntity with status 201 (Created) and with body the new pic, or with status 400 (Bad Request) if the pic has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/pics")
    @Timed
    public ResponseEntity<Pic> createPic(@Valid @RequestBody Pic pic) throws URISyntaxException {
        log.debug("REST request to save Pic : {}", pic);
        if (pic.getId() != null) {
            throw new BadRequestAlertException("A new pic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pic result = picRepository.save(pic);
        picSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/pics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /pics : Updates an existing pic.
     *
     * @param pic the pic to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated pic,
     * or with status 400 (Bad Request) if the pic is not valid,
     * or with status 500 (Internal Server Error) if the pic couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/pics")
    @Timed
    public ResponseEntity<Pic> updatePic(@Valid @RequestBody Pic pic) throws URISyntaxException {
        log.debug("REST request to update Pic : {}", pic);
        if (pic.getId() == null) {
            return createPic(pic);
        }
        Pic result = picRepository.save(pic);
        picSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, pic.getId().toString()))
            .body(result);
    }

    /**
     * GET  /pics : get all the pics.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of pics in body
     */
    @GetMapping("/pics")
    @Timed
    public List<Pic> getAllPics() {
        log.debug("REST request to get all Pics");
        return picRepository.findAll();
        }

    /**
     * GET  /coursecomments/{id} : get the comments of one course.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of comments in body
     */
    @GetMapping("/coursepics/{id}")
    @Timed
    public List<Pic> getCoursePic(@PathVariable Long id) {
        log.debug("REST request to get all Comments");
        return picRepository.findByCourseId(id);
    }

    /**
     * GET  /pics/:id : get the "id" pic.
     *
     * @param id the id of the pic to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the pic, or with status 404 (Not Found)
     */
    @GetMapping("/pics/{id}")
    @Timed
    public ResponseEntity<Pic> getPic(@PathVariable Long id) {
        log.debug("REST request to get Pic : {}", id);
        Pic pic = picRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(pic));
    }

    /**
     * DELETE  /pics/:id : delete the "id" pic.
     *
     * @param id the id of the pic to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/pics/{id}")
    @Timed
    public ResponseEntity<Void> deletePic(@PathVariable Long id) {
        log.debug("REST request to delete Pic : {}", id);
        picRepository.delete(id);
        picSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/pics?query=:query : search for the pic corresponding
     * to the query.
     *
     * @param query the query of the pic search
     * @return the result of the search
     */
    @GetMapping("/_search/pics")
    @Timed
    public List<Pic> searchPics(@RequestParam String query) {
        log.debug("REST request to search Pics for query {}", query);
        return StreamSupport
            .stream(picSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
