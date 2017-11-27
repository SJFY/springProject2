package com.hopefully.repository;

import com.hopefully.domain.Course;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Course entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("select course from Course course where course.teacher.login = ?#{principal.username}")
    List<Course> findByTeacherIsCurrentUser();

    @Query("select course from Course course where course.category = com.hopefully.domain.enumeration.Categories.Fitness")
    List<Course> findAllFitnessCourse();

    @Query("select course from Course course where course.category = com.hopefully.domain.enumeration.Categories.Academic")
    List<Course> findAllAcademicCourse();

    @Query("select course from Course course where course.category = com.hopefully.domain.enumeration.Categories.IT")
    List<Course> findAllITCourse();

    @Query("select course from Course course where course.category = com.hopefully.domain.enumeration.Categories.Language")
    List<Course> findAllLanguageCourse();

    @Query("select course from Course course where course.category = com.hopefully.domain.enumeration.Categories.Lifestyle")
    List<Course> findAllLifeCourse();

    @Query("select course from Course course where course.category = com.hopefully.domain.enumeration.Categories.Music")
    List<Course> findAllMusicCourse();

}
