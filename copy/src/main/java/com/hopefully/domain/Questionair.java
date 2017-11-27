package com.hopefully.domain;

import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Questionair.
 */
@Entity
@Table(name = "questionair")
@Document(indexName = "questionair")
public class Questionair extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Lob
    @Column(name = "jhi_view", nullable = false)
    private String view;

    @ManyToOne
    private Course course;

    @ManyToOne
    private User user;

    @ManyToOne
    private Questionair questionair;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getView() {
        return view;
    }

    public Questionair view(String view) {
        this.view = view;
        return this;
    }

    public void setView(String view) {
        this.view = view;
    }

    public Course getCourse() {
        return course;
    }

    public Questionair course(Course course) {
        this.course = course;
        return this;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getUser() {
        return user;
    }

    public Questionair user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Questionair getQuestionair() {
        return questionair;
    }

    public Questionair questionair(Questionair questionair) {
        this.questionair = questionair;
        return this;
    }

    public void setQuestionair(Questionair questionair) {
        this.questionair = questionair;
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
        Questionair questionair = (Questionair) o;
        if (questionair.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionair.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Questionair{" +
            "id=" + getId() +
            ", view='" + getView() + "'" +
            "}";
    }
}
