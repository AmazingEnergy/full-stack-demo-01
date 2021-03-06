package com.example.fullstackdemo1.student;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/v1/students")
@AllArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @GetMapping
    public List<Student> getAllStudents(@Param("searchText") String searchText) {
        return studentService.getAll(searchText);
    }

    @GetMapping("{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable("studentId") String studentId) {
        return studentService.getById(Long.parseLong(studentId))
                .map(student -> ResponseEntity.ok().body(student))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Student addStudent(@Valid @RequestBody Student student) {
        var savedStudent = studentService.add(student);
        log.info("Created Student Id:" + savedStudent.getId());
        return savedStudent;
    }

    @PutMapping("{studentId}")
    public ResponseEntity<Student> updateStudent(@PathVariable("studentId") String studentId, @RequestBody Student student) {
        var response = studentService.update(Long.parseLong(studentId), student)
                .map(updatedStudent -> ResponseEntity.ok().body(updatedStudent))
                .orElseGet(() -> ResponseEntity.notFound().build());
        log.info("Updated Student Id:" + studentId);
        return response;
    }

    @DeleteMapping("{studentId}")
    public ResponseEntity<Long> deleteStudent(@PathVariable("studentId") String studentId) {
        var response = studentService.delete(Long.parseLong(studentId))
                .map(deletedStudentId -> ResponseEntity.ok().body(deletedStudentId))
                .orElseGet(() -> ResponseEntity.notFound().build());
        log.info("Deleted Student Id:" + studentId);
        return response;
    }
}
