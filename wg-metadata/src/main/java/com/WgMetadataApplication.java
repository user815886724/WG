package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableEurekaClient
@ComponentScan(value = "com.*")
public class WgMetadataApplication {

	public static void main(String[] args) {
		SpringApplication.run(WgMetadataApplication.class, args);
	}

}
