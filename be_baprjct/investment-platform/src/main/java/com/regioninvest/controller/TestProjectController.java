package com.regioninvest.controller;

import com.regioninvest.dto.ProjectDTO;
import com.regioninvest.dto.ProjectCreateRequest;
import com.regioninvest.dto.ApiResponse;
import com.regioninvest.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<ProjectDTO>> createTestProject(
            @Valid @RequestBody ProjectCreateRequest request) {
        try {
            System.out.println("🧪 TEST: Received request: " + request.getTitle());
            ProjectDTO createdProject = projectService.createProject(request, null, null, "porteur1");
            System.out.println("🧪 TEST: Project created successfully with ID: " + createdProject.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdProject, "Test project created successfully"));
        } catch (Exception e) {
            System.err.println("🧪 TEST ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error: " + e.getMessage()));
        }
    }
}
