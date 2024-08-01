import Login from "@/app/Components/AuthComponents/login";

export default function LoginPage() {
    return (
        <>
            <div className="bg-[#f6f3fa]">
                <div className="container mx-auto p-4 flex items-center justify-center h-screen">
                    <div className="max-w-md w-full">
                        <Login />
                    </div>
                </div>
            </div>
        </>
    )
}
