package com.hopefully.repository.search;

import com.hopefully.domain.Questionair;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Questionair entity.
 */
public interface QuestionairSearchRepository extends ElasticsearchRepository<Questionair, Long> {
}
