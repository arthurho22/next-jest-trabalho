import { Request, Response, Headers } from "node-fetch";

(global as any).Request = Request;
(global as any).Response = Response;
(global as any).Headers = Headers;