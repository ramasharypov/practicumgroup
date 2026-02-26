import svgPaths from "./svg-16r0pl3rcx";
import imgImage1 from "figma:asset/202a5fea03d48a92c4e74143723ce83d91c32954.png";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute aspect-[768/370] left-0 right-0 top-[116px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <div className="absolute h-[275px] left-[14.5px] top-[-2.5px] w-[479px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 479 275">
          <path d={svgPaths.p14d6c900} fill="var(--fill-0, #FF5E0E)" id="Polygon 2" />
        </svg>
      </div>
      <div className="absolute h-[123.5px] left-[288px] top-[341px] w-[387px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 387 123.5">
          <path d={svgPaths.p35da4600} fill="var(--fill-0, #1192E6)" id="Polygon 3" />
        </svg>
      </div>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-[209.5px] not-italic text-[0px] text-center text-white top-[58px] w-[213px] whitespace-pre-wrap">
        <span className="leading-[normal] text-[16px]">{`я просмотрел `}</span>
        <span className="leading-[normal] text-[48px]">404</span>
        <span className="leading-[normal] text-[16px]">{` миллиона возможных вариантов страниц, но не нашел нужной`}</span>
      </p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[527.5px] not-italic text-[15px] text-center text-white top-[391px]">это тревожное расстройтсво…</p>
    </div>
  );
}