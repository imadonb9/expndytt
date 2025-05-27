import { getUser } from "@/auth/stack-auth";
import  {Openint}  from "@openint/connect";

export async function POST(req: Request) {

  // the backend will not return a token if the OPENINT_API_KEY is not set, making the <IntegrationsButton /> component render null
  if (!process.env.OPENINT_API_KEY) {
    return new Response(JSON.stringify({
      token: null,
    }), { status: 200 });
  }
  const {userId} = await getUser();

  const openint = new Openint({
    token: process.env.OPENINT_API_KEY,
  });

  try {
  const {token} = await openint.createToken(userId, {});

  return new Response(JSON.stringify({
    token,
  }));
  } catch (error) {
    console.error("Error creating Openint token", error);
    return new Response("Error creating Openint token", { status: 500 });
  }
}