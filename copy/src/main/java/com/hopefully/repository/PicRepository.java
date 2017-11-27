package com.hopefully.repository;

import com.hopefully.domain.Pic;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the Pic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PicRepository extends JpaRepository<Pic, Long> {

    @Query("select pic from Pic pic where pic.coursepic.id = ?#{#Id}")
    List<Pic> findByCourseId(@Param("Id") Long Id);

}
