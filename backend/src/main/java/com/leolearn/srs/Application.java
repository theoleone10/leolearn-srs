package com.leolearn.srs;



import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoReactiveAutoConfiguration;
import org.springframework.boot.autoconfigure.neo4j.Neo4jAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import com.leolearn.srs.flashcard.Flashcard;
import com.leolearn.srs.flashcard.JdbcClientFlashcardRepository;
import com.leolearn.srs.user.User;
import com.leolearn.srs.user.UserHttpClient;
import com.leolearn.srs.user.UserRestClient;


@SpringBootApplication
public class Application {

	// private static final Logger log = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);

        
	}

	// @Bean
	// UserHttpClient userHttpClient() {
	// 	RestClient restClient = RestClient.create("https://jsonplaceholder.typicode.com");
	// 	HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(RestClientAdapter.create(restClient)).build();
	// 	return factory.createClient(UserHttpClient.class);
	// }

	// @Bean
	// CommandLineRunner runner(UserHttpClient client) {
	// 	return args -> {
	// 		// List<User> users = client.findAll();
	// 		// System.out.println(users);

	// 		User user = client.findById(1);
	// 		System.out.println(user);
	// 	};
	// }

}
