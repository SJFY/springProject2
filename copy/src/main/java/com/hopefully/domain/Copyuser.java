package com.hopefully.domain;

import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Copyuser.
 */
@Entity
@Table(name = "copyuser")
@Document(indexName = "copyuser")
public class Copyuser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "avater")
    private byte[] avater;

    @Column(name = "avater_content_type")
    private String avaterContentType;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    @ManyToMany
    @JoinTable(name = "copyuser_course",
               joinColumns = @JoinColumn(name="copyusers_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="courses_id", referencedColumnName="id"))
    private Set<Course> courses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getAvater() {
        return avater;
    }

    public Copyuser avater(byte[] avater) {
        this.avater = avater;
        return this;
    }

    public void setAvater(byte[] avater) {
        this.avater = avater;
    }

    public String getAvaterContentType() {
        return avaterContentType;
    }

    public Copyuser avaterContentType(String avaterContentType) {
        this.avaterContentType = avaterContentType;
        return this;
    }

    public void setAvaterContentType(String avaterContentType) {
        this.avaterContentType = avaterContentType;
    }

    public User getUser() {
        return user;
    }

    public Copyuser user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Course> getCourses() {
        return courses;
    }

    public Copyuser courses(Set<Course> courses) {
        this.courses = courses;
        return this;
    }

    public Copyuser addCourse(Course course) {
        this.courses.add(course);
        course.getStudents().add(this);
        return this;
    }

    public Copyuser removeCourse(Course course) {
        this.courses.remove(course);
        course.getStudents().remove(this);
        return this;
    }

    public void setCourses(Set<Course> courses) {
        this.courses = courses;
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
        Copyuser copyuser = (Copyuser) o;
        if (copyuser.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), copyuser.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Copyuser{" +
            "id=" + getId() +
            ", avater='" + getAvater() + "'" +
            ", avaterContentType='" + avaterContentType + "'" +
            "}";
    }
}
