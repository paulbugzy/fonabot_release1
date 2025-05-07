@@ .. @@
   DATABASE_USERNAME: Joi.string().required(),
   DATABASE_PASSWORD: Joi.string().required(),
   DATABASE_NAME: Joi.string().required(),
-  JWT_SECRET: Joi.string().required(),
+  JWT_SECRET: Joi.string().required(),
+  MASTER_ENCRYPTION_KEY: Joi.string().required().length(64),
 });