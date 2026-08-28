import PhoneShot from "./PhoneShot";
import todayShot from "@/public/screens/today.png";

/* Hero device: the real Today screen from the app (demo farm) — greeting,
   who's on the farm, the dry window, and the ready-to-cut cards. */

export default function HeroPhone() {
  return (
    <PhoneShot
      src={todayShot}
      alt="TopHand's Today screen: morning greeting, live weather with an open dry window, and fields flagged ready to cut"
      width={300}
      priority
    />
  );
}
