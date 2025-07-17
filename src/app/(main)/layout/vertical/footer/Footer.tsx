
const FooterLayout = () => {
    return (
        <footer className="text-sm px-4 py-6 text-center h-[100px]">
            <div className="flex justify-center items-center space-x-2">
            <img src="/images/icons/ministry_public_health_icon.png" alt="โลโก้กรมอนามัย" className="h-6" />
            <span>ข้อมูลอ้างอิงจาก สำนักโภชนาการ กรมอนามัย กระทรวงสาธารณสุข</span>
            </div>
            <div className="mt-1">
            เอกสาร: ตารางแสดงคุณค่าทางโภชนาการของอาหารไทย, September 2018
            </div>
            <div className="text-xs text-gray-400 mt-2">
            © 2025 NutriTachy. All rights reserved.
            </div>
        </footer>
    )
}

export default FooterLayout;