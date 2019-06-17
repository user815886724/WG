package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

@EnableConfigServer
@SpringBootApplication
@EnableAutoConfiguration
public class WgConfigServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(WgConfigServerApplication.class, args);
	}

}
