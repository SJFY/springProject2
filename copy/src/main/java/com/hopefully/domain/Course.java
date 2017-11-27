package com.hopefully.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.hopefully.domain.enumeration.Districts;

import com.hopefully.domain.enumeration.Categories;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Document(indexName = "course")
public class Course extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "price", nullable = false)
    private Float price;

    @NotNull
    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "rating")
    private Float rating;

    @Enumerated(EnumType.STRING)
    @Column(name = "district")
    private Districts district;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Categories category;

    @ManyToMany(mappedBy = "courses")
    @JsonIgnore
    private Set<Copyuser> students = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    private User teacher;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Course name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getPrice() {
        return price;
    }

    public Course price(Float price) {
        this.price = price;
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public Course description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getRating() {
        return rating;
    }

    public Course rating(Float rating) {
        this.rating = rating;
        return this;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public Districts getDistrict() {
        return district;
    }

    public Course district(Districts district) {
        this.district = district;
        return this;
    }

    public void setDistrict(Districts district) {
        this.district = district;
    }

    public Categories getCategory() {
        return category;
    }

    public Course category(Categories category) {
        this.category = category;
        return this;
    }

    public void setCategory(Categories category) {
        this.category = category;
    }

    public Set<Copyuser> getStudents() {
        return students;
    }

    public Course students(Set<Copyuser> copyusers) {
        this.students = copyusers;
        return this;
    }

    public Course addStudents(Copyuser copyuser) {
        this.students.add(copyuser);
        copyuser.getCourses().add(this);
        return this;
    }

    public Course removeStudents(Copyuser copyuser) {
        this.students.remove(copyuser);
        copyuser.getCourses().remove(this);
        return this;
    }

    public void setStudents(Set<Copyuser> copyusers) {
        this.students = copyusers;
    }

    public User getTeacher() {
        return teacher;
    }

    public Course teacher(User user) {
        this.teacher = user;
        return this;
    }

    public void setTeacher(User user) {
        this.teacher = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Course course = (Course) o;
        if (course.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), course.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", price='" + getPrice() + "'" +
            ", description='" + getDescription() + "'" +
            ", rating='" + getRating() + "'" +
            ", district='" + getDistrict() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}
