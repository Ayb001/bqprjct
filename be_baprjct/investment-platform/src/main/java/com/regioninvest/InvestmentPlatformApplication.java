package com.regioninvest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan(basePackages = "com.regioninvest")
@EnableJpaRepositories(basePackages = "com.regioninvest")
@ComponentScan(basePackages = "com.regioninvest")
@EnableScheduling // Enable scheduling for automatic news fetching
public class InvestmentPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(InvestmentPlatformApplication.class, args);
		System.out.println("🚀 Investment Platform Started Successfully!");
		System.out.println("📊 API Base URL: http://localhost:8080/api");
		System.out.println("📰 Articles API: http://localhost:8080/api/articles");
		System.out.println("🗄️  H2 Database Console: http://localhost:8080/h2-console");
		System.out.println("✅ Ready to accept requests!");
		System.out.println("🔄 Automatic news fetching enabled (every 6 hours)");
	}
}