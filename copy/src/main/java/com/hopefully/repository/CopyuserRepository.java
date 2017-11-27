package com.hopefully.repository;

import com.hopefully.domain.Copyuser;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Copyuser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CopyuserRepository extends JpaRepository<Copyuser, Long> {
    @Query("select distinct copyuser from Copyuser copyuser left join fetch copyuser.courses")
    List<Copyuser> findAllWithEagerRelationships();

    @Query("select copyuser from Copyuser copyuser left join fetch copyuser.courses where copyuser.id =:id")
    Copyuser findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select copyuser from Copyuser copyuser left join fetch copyuser.courses where copyuser.user.id =:id")
    Copyuser findByUserId(@Param("id") Long id);


}
