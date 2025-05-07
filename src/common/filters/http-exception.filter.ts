@@ .. @@
   private readonly logger = new Logger(HttpExceptionFilter.name);
 
   catch(exception: HttpException, host: ArgumentsHost) {
+    const ctx = host.switchToHttp();
+    const response = ctx.getResponse<Response>();
+    const request = ctx.getRequest<Request>();
+    const status = exception.getStatus();
+    const message = exception.message;
+
+    // Sanitize error details for production
+    const errorResponse = {
+      statusCode: status,
+      timestamp: new Date().toISOString(),
+      path: request.url,
+      message: process.env.NODE_ENV === 'production' 
+        ? this.sanitizeErrorMessage(message)
+        : message,
+    };
+
+    this.logger.error(
+      `${request.method} ${request.url} ${status}`,
+      exception.stack,
+    );
+
+    response.status(status).json(errorResponse);
+  }
+
+  private sanitizeErrorMessage(message: string): string {
+    // Generic messages for sensitive errors
+    if (message.toLowerCase().includes('password') ||
+        message.toLowerCase().includes('token') ||
+        message.toLowerCase().includes('credential')) {
+      return 'Authentication error occurred';
+    }
+    if (message.toLowerCase().includes('database')) {
+      return 'Internal server error';
+    }
+    return message;
   }