package com.regioninvest.controller;

import com.regioninvest.dto.ApiResponse;
import com.regioninvest.dto.InvestmentRequest;
import com.regioninvest.entity.Investment;
import com.regioninvest.entity.User;
import com.regioninvest.service.InvestmentService;
import com.regioninvest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investments")
@CrossOrigin(origins = "*")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @Autowired
    private UserService userService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username).orElseThrow();
    }

    @PostMapping("/rendezvous")
    public ResponseEntity<ApiResponse<String>> createRendezVous(@RequestBody Map<String, Object> request) {
        try {
            com.regioninvest.entity.InvestmentRequest saved = investmentService.saveRendezVousRequest(request);
            return ResponseEntity.ok(ApiResponse.success("Demande de rendez-vous soumise avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Erreur lors de la soumission: " + e.getMessage()));
        }
    }

    @GetMapping("/rendezvous")
    public ResponseEntity<ApiResponse<List<com.regioninvest.entity.InvestmentRequest>>> getAllRendezVous() {
        try {
            List<com.regioninvest.entity.InvestmentRequest> requests = investmentService.getAllRendezVousRequests();
            return ResponseEntity.ok(ApiResponse.success(requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Erreur lors de la récupération: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createInvestment(@Valid @RequestBody InvestmentRequest request) {
        try {
            User currentUser = getCurrentUser();
            Investment investment = investmentService.createInvestment(currentUser, request);
            return ResponseEntity.ok(investment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<Investment>> getUserInvestments() {
        User currentUser = getCurrentUser();
        List<Investment> investments = investmentService.getUserInvestments(currentUser);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInvestment(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            Investment investment = investmentService.getInvestmentById(id, currentUser);
            return ResponseEntity.ok(investment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Investment not found");
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvestment(@PathVariable Long id, @Valid @RequestBody InvestmentRequest request) {
        try {
            User currentUser = getCurrentUser();
            Investment investment = investmentService.updateInvestment(id, currentUser, request);
            return ResponseEntity.ok(investment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvestment(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            investmentService.deleteInvestment(id, currentUser);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Investment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/portfolio")
    public ResponseEntity<?> getPortfolioSummary() {
        try {
            User currentUser = getCurrentUser();

            List<Investment> investments = investmentService.getUserInvestments(currentUser);
            BigDecimal totalValue = investmentService.getTotalInvestmentValue(currentUser);

            Map<String, Object> portfolio = new HashMap<>();
            portfolio.put("investments", investments);
            portfolio.put("totalValue", totalValue);
            portfolio.put("totalInvestments", investments.size());
            portfolio.put("investmentsByType", investmentService.getInvestmentsByType(currentUser));

            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}