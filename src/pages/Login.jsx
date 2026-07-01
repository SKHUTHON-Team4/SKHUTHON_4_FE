export default function Login() {
  const handleKakaoLogin = () => {
    window.location.href = import.meta.env.DEV
      ? '/oauth2/authorization/kakao'
      : 'https://gksruf.store/oauth2/authorization/kakao';
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#FAF8FF] px-8 py-14"
      style={{
        backgroundImage: 'url(/assets/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <div className="pointer-events-none absolute right-[16%] top-[41%] z-0 h-40 w-44 rounded-full bg-[#D9CBFF]/90 blur-2xl" />

      {/* 상단 */}
      <div className="relative z-10 flex flex-col items-center pt-20 text-center sm:pt-10">
        <p className="text-sm font-extrabold text-primary">
          청춘을 잇는 감정 기록
        </p>

        <h1 className="mt-2 text-5xl font-black tracking-tight text-gray-900">
          청춘잇다
        </h1>

        <div className="mt-8 flex items-center justify-center">
          <img
            src="/assets/bear-face.png"
            alt="청춘잇다 캐릭터 얼굴"
            className="h-52 w-52 object-contain drop-shadow-[0_14px_24px_rgba(124,92,252,0.2)]"
          />
        </div>
      </div>

      {/* 하단 */}
      <div className="relative z-10 flex flex-col items-center">
        <button
          onClick={handleKakaoLogin}
          className="w-full max-w-[360px] rounded-2xl bg-[#FEE500] py-4 text-[17px] font-bold text-[#191919] shadow-sm transition hover:brightness-95"
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
