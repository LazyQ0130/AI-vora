import Image from "next/image";
import { artwork } from "@/lib/artwork";

export function HeroArt() {
  return (
    <>
      <Image
        className="hero-landscape"
        src={artwork.hero}
        alt=""
        fill
        preload
        unoptimized
        sizes="100vw"
      />
      <div className="hero-scene-shade" />
      <div className="hero-brand-lockup" aria-hidden="true">
        <span className="hero-brand-eyebrow">
          A NEW HORIZON OF UNDERSTANDING
        </span>
        <div className="hero-brand-name">
          <Image src="/brand/aivora-mark.svg" width={124} height={124} alt="" />
          <span>Aivora</span>
        </div>
        <span className="hero-brand-tagline">
          系 统 化 AI 技 术 学 习 平 台
        </span>
      </div>
    </>
  );
}
