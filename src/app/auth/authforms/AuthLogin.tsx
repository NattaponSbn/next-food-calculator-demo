"use client";

// Core React/Next.js imports
import { useRouter } from "next/navigation";

// Form management imports (ส่วนที่ต้องเพิ่ม/แก้ไข)
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/app/lib/validations/auth";
import { handleToastPromise } from "@/app/lib/toast-helper";

// UI & Helper imports
import { Button, Label, TextInput, HelperText } from "flowbite-react";
import { signIn, SignInResponse } from "next-auth/react";
import toast from 'react-hot-toast';


const AuthLogin = () => {
  const router = useRouter();

  // 1. แทนที่ useState ทั้งหมดด้วย useForm
  const {
    control, // 👈 ใช้ 'control' สำหรับเชื่อมกับ UI Library
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      // isRemember: false,
    },
  });

   // 2. สร้างฟังก์ชัน onSubmit
  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    const loginPromise = signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    handleToastPromise(loginPromise, {
      loading: 'กำลังตรวจสอบข้อมูล...',
      success: (result) => {
        if (result?.ok) {
          router.push("/ui/expanded-raw-material");
          router.refresh();
          return 'เข้าสู่ระบบสำเร็จ!';
        } else {
          throw new Error(result?.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
      },
      error: (err) => err.toString(),
    });
  };
  
  return (
    <>
      <form noValidate>
        <div className="mb-4">
           <div className="mb-2 block">
            <Label htmlFor="username" value="Username" color={errors.username ? 'failure' : 'gray'} />
          </div>
          {/* 4. เชื่อม TextInput ของ Flowbite กับ React Hook Form */}
          <TextInput
            id="username"
            type="text"
            sizing="md"
            className={`form-control form-rounded-xl ${errors.username && 'has-error'}`}
            disabled={isSubmitting}
            {...register("username")} // TextInput ของ Flowbite รองรับ register โดยตรง
          />
          {/* 5. แสดงข้อความ Error */}
          {errors.username && (
            <HelperText color="failure" className="text-end">{errors.username.message}</HelperText>
          )}
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" color={errors.password ? 'failure' : 'gray'} />
          </div>
          <TextInput
            id="userpwd"
            type="password"
            sizing="md"
            className={`form-control form-rounded-xl ${errors.password && 'has-error'}`}
            disabled={isSubmitting}
            {...register("password")} // TextInput ของ Flowbite รองรับ register โดยตรง
          />
          {errors.password && (
            <HelperText color="failure" className="text-end">{errors.password.message}</HelperText>
          )}
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
        <Button color={"primary"} onClick={handleSubmit(onSubmit)} className="w-full bg-primary text-white rounded-xl">
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
