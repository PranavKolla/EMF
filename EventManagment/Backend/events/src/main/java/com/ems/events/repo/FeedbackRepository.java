package com.ems.events.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ems.events.entity.Feedback;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEventEventIdAndIsActiveTrue(Long eventId);
    List<Feedback> findByUserUserIdAndIsActiveTrue(Long userId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.event.eventId = :eventId AND f.isActive = true")
    Optional<Double> findAverageRatingByEventId(@Param("eventId") Long eventId);
}
