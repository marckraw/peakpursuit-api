import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// cant get access to dependency injection services etc, so we need to have interceptor (it will solve this problem)
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.currentUser);
    return request.currentUser;
  },
);
