export default function Login() {
  const handleKakaoLogin = () => {
    window.location.href =
      'https://gksruf.store/oauth2/authorization/kakao';
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8FF] px-8 py-14">
      {/* 상단 */}
      <div className="pt-10">
        <h1 className="text-5xl font-black tracking-tight text-primary">
          청춘잇다
        </h1>

        <p className="mt-6 text-[17px] leading-8 text-gray-500">
          오늘의 감정을 기록하고,
          <br />
          나만의 공간을 시작해보세요.
        </p>
      </div>

      {/* 하단 */}
      <div>
        <button
          onClick={handleKakaoLogin}
          className="w-full rounded-2xl bg-[#FEE500] py-4 text-[17px] font-bold text-[#191919] shadow-sm transition hover:brightness-95"
        >
          카카오로 시작하기
        </button>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          로그인 시 이용약관 및 개인정보처리방침에
          <br />
          동의한 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}