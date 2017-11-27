package com.hopefully.domain;

import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Comment.
 */
@Entity
@Table(name = "comment")
@Document(indexName = "comment")
public class Comment extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @NotNull
    @Lob
    @Column(name = "review", nullable = false)
    private String review;

    @ManyToOne(optional = false)
    @NotNull
    private Copyuser writter;

    @ManyToOne(optional = false)
    @NotNull
    private Course targetcourse;

    @ManyToOne
    private Comment parent;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public Comment rating(Integer rating) {
        this.rating = rating;
        return this;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public Comment review(String review) {
        this.review = review;
        return this;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Copyuser getWritter() {
        return writter;
    }

    public Comment writter(Copyuser copyuser) {
        this.writter = copyuser;
        return this;
    }

    public void setWritter(Copyuser copyuser) {
        this.writter = copyuser;
    }

    public Course getTargetcourse() {
        return targetcourse;
    }

    public Comment targetcourse(Course course) {
        this.targetcourse = course;
        return this;
    }

    public void setTargetcourse(Course course) {
        this.targetcourse = course;
    }

    public Comment getParent() {
        return parent;
    }

    public Comment parent(Comment comment) {
        this.parent = comment;
        return this;
    }

    public void setParent(Comment comment) {
        this.parent = comment;
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
        Comment comment = (Comment) o;
        if (comment.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), comment.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", rating='" + getRating() + "'" +
            ", review='" + getReview() + "'" +
            "}";
    }
}
