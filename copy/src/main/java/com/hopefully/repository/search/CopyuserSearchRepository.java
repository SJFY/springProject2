package com.hopefully.repository.search;

import com.hopefully.domain.Copyuser;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Copyuser entity.
 */
public interface CopyuserSearchRepository extends ElasticsearchRepository<Copyuser, Long> {
}
