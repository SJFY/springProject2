package com.hopefully.repository.search;

import com.hopefully.domain.Pic;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Pic entity.
 */
public interface PicSearchRepository extends ElasticsearchRepository<Pic, Long> {
}
