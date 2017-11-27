package com.hopefully.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.hopefully.domain.Copyuser;

import com.hopefully.repository.CopyuserRepository;
import com.hopefully.repository.search.CopyuserSearchRepository;
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
 * REST controller for managing Copyuser.
 */
@RestController
@RequestMapping("/api")
public class CopyuserResource {

    private final Logger log = LoggerFactory.getLogger(CopyuserResource.class);

    private static final String ENTITY_NAME = "copyuser";

    private final CopyuserRepository copyuserRepository;

    private final CopyuserSearchRepository copyuserSearchRepository;

    public CopyuserResource(CopyuserRepository copyuserRepository, CopyuserSearchRepository copyuserSearchRepository) {
        this.copyuserRepository = copyuserRepository;
        this.copyuserSearchRepository = copyuserSearchRepository;
    }

    /**
     * POST  /copyusers : Create a new copyuser.
     *
     * @param copyuser the copyuser to create
     * @return the ResponseEntity with status 201 (Created) and with body the new copyuser, or with status 400 (Bad Request) if the copyuser has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/copyusers")
    @Timed
    public ResponseEntity<Copyuser> createCopyuser(@Valid @RequestBody Copyuser copyuser) throws URISyntaxException {
        log.debug("REST request to save Copyuser : {}", copyuser);
        if (copyuser.getId() != null) {
            throw new BadRequestAlertException("A new copyuser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Copyuser result = copyuserRepository.save(copyuser);
        copyuserSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/copyusers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /copyusers : Updates an existing copyuser.
     *
     * @param copyuser the copyuser to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated copyuser,
     * or with status 400 (Bad Request) if the copyuser is not valid,
     * or with status 500 (Internal Server Error) if the copyuser couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/copyusers")
    @Timed
    public ResponseEntity<Copyuser> updateCopyuser(@Valid @RequestBody Copyuser copyuser) throws URISyntaxException {
        log.debug("REST request to update Copyuser : {}", copyuser);
        if (copyuser.getId() == null) {
            return createCopyuser(copyuser);
        }
        Copyuser result = copyuserRepository.save(copyuser);
        copyuserSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, copyuser.getId().toString()))
            .body(result);
    }

    /**
     * GET  /copyusers : get all the copyusers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of copyusers in body
     */
    @GetMapping("/copyusers")
    @Timed
    public List<Copyuser> getAllCopyusers() {
        log.debug("REST request to get all Copyusers");
        return copyuserRepository.findAllWithEagerRelationships();
        }

    /**
     * GET  /copyusersByuser/:id : get the "id" copyuser.
     *
     * @param id the id of the copyuser to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the copyuser, or with status 404 (Not Found)
     */
    @GetMapping("/copyuserByuser/{id}")
    @Timed
    public ResponseEntity<Copyuser> getCopyuserByUser(@PathVariable Long id) {
        log.debug("REST request to get Copyuser : {}", id);
        Copyuser copyuser = copyuserRepository.findByUserId(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(copyuser));
    }

    /**
     * GET  /copyusers/:id : get the "id" copyuser.
     *
     * @param id the id of the copyuser to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the copyuser, or with status 404 (Not Found)
     */
    @GetMapping("/copyusers/{id}")
    @Timed
    public ResponseEntity<Copyuser> getCopyuser(@PathVariable Long id) {
        log.debug("REST request to get Copyuser : {}", id);
        Copyuser copyuser = copyuserRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(copyuser));
    }

    /**
     * DELETE  /copyusers/:id : delete the "id" copyuser.
     *
     * @param id the id of the copyuser to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/copyusers/{id}")
    @Timed
    public ResponseEntity<Void> deleteCopyuser(@PathVariable Long id) {
        log.debug("REST request to delete Copyuser : {}", id);
        copyuserRepository.delete(id);
        copyuserSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/copyusers?query=:query : search for the copyuser corresponding
     * to the query.
     *
     * @param query the query of the copyuser search
     * @return the result of the search
     */
    @GetMapping("/_search/copyusers")
    @Timed
    public List<Copyuser> searchCopyusers(@RequestParam String query) {
        log.debug("REST request to search Copyusers for query {}", query);
        return StreamSupport
            .stream(copyuserSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
