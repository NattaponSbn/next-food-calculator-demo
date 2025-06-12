import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AuthLogin = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRemeber, setIsRemeber] = useState<any>(false);

  const router = useRouter(); // สร้าง instance ของ router

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res) {
      // ไปหน้าอื่น
       router.push("/");
       router.refresh(); 
    } else {
      alert("Login failed");
    }
  };
  return (
    <>
      <form>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="Username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            sizing="md"
            onChange={(e) => setUsername(e.target.value)}
            className="form-control form-rounded-xl"
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="userpwd"
            type="password"
            sizing="md"
            onChange={(e) => setPassword(e.target.value)}
            className="form-control form-rounded-xl"
          />
        </div>
        {/* <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" onChange={(e) => setIsRemeber(e.target.value)} />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remeber this Device
            </Label>
          </div>
          <Link href={"/"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div> */}
        <Button color={"primary"} onClick={handleLogin} className="w-full bg-primary text-white rounded-xl">
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
