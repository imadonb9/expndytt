import  OpenInt  from "@openint/sdk";
import { cookies } from "next/headers";

export async function POST(req: Request) {
 // In future change to useUser stack auth once they roll out anonymous ids https://github.com/stack-auth/stack-auth/issues/639
  const COOKIE_NAME = "anonId";
  const cookieStore = await cookies();
  const anonId = cookieStore.get(COOKIE_NAME)?.value;

  if (!anonId) {
    return new Response("Integration Button requires an anonId cookie to be set", { status: 401 });
  }

  const openint = new OpenInt({
    token: process.env.OPENINT_API_KEY,
  });
  
  try {
    // note this API is bring upgraded shortly in a backwards compatible way to create tokens that are more appropriate for code generation
  const {token} = await openint.createToken(anonId, {});

  console.log("Openint token created", token);

  return new Response(JSON.stringify({
    token,
  }));
  } catch (error) {
    console.error("Error creating Openint token", error);
    return new Response("Error creating Openint token", { status: 500 });
  }
}