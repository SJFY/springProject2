package com.hopefully.repository;

import com.hopefully.domain.Comment;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the Comment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("select comment from Comment comment where comment.targetcourse.id = ?#{#Id}")
    List<Comment> findByCourseId(@Param("Id") Long Id);

    @Query("select comment from Comment comment where comment.writter.id = ?#{#Id}")
    List<Comment> findByCuId(@Param("Id") Long Id);

}
