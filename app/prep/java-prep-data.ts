import { experienceCategory } from "./experience-prep";
import { javaCoreCategory } from "./java-core-prep";
import { jpaHibernateCategory, sqlDatabaseCategory } from "./jpa-sql-prep";
import { microservicesCategory } from "./microservices-prep";
import { PrepCategory } from "./prep-types";
import { springRestCategory } from "./spring-rest-prep";
import { testingDesignCategory } from "./testing-design-prep";

export const javaPrepCategories: PrepCategory[] = [
  javaCoreCategory,
  springRestCategory,
  jpaHibernateCategory,
  sqlDatabaseCategory,
  microservicesCategory,
  testingDesignCategory,
  experienceCategory,
];
