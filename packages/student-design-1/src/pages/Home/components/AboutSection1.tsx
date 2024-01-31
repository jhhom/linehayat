import { JSX } from "solid-js";
import {
  IconEmail,
  IconFacebook,
  IconInstagram,
  IconLinkedin,
} from "~/common/Icons";

export function AboutSection1() {
  return (
    <div class="font-print-clearly mt-24 text-yellow-900/90">
      <h1 class="text-center font-berkshire text-3xl text-black">
        About LineHayat
      </h1>
      <div class="flex items-center justify-between">
        <div class="basis-[50%] text-2xl">
          <h2 class="mt-6 font-berkshire text-gray-700">Who We Are:</h2>
          <div class="mt-2 space-y-3 pt-4  leading-8 tracking-normal">
            <p>
              LineHayat is a Listening Service that aims to provide peer support
              to Universiti Sains Malaysia (USM) students.
            </p>
            <p>
              This service is run by students for students to ensure comfortable
              communication and it is completely free-of-charge.
            </p>
            <p>
              We also understand the need to maintain privacy when it comes to
              talking about problems.
            </p>
            <p>Therefore, we are established on these three main ideas:</p>
          </div>
          <ul class="mt-4 list-inside list-disc space-y-2 leading-8 tracking-normal">
            <li>Anonymous peer support</li>
            <li>Trained volunteerism</li>
            <li>Peer capacity building</li>
          </ul>
        </div>
        <div class="basis-[40%]">
          <img
            class="animate-space-floating-1 ml-auto max-w-[550px]"
            src="/home/space-boy-who-we-are.svg"
          />
        </div>
      </div>

      <div class="mt-24 flex items-center justify-between">
        <div class="basis-[40%]">
          <img
            class="animate-space-floating-2 ml-auto max-w-[550px]"
            src="/home/space-boy-who-we-are-not.svg"
          />
        </div>
        <div class="basis-[50%]">
          <h2 class="mt-6 font-berkshire text-2xl text-gray-700">
            Who We Are Not:
          </h2>
          <div class="mt-2 space-y-3 pt-4 text-2xl leading-8 tracking-normal">
            <p>
              LineHayat is not a counselling or a professional mental health
              service.
            </p>
            <p>
              We are not associated with any mental health professionals such as
              psychologists, psychiatrists, counsellors, therapists, or social
              workers.
            </p>
            <p>We are volunteers that provide only emotional support.</p>
            <p>Sharers should always seek professional help if possible.</p>
          </div>
        </div>
      </div>

      <div class="mt-24 flex items-center justify-between">
        <div class="basis-[50%]">
          <h2 class="mt-6 font-berkshire text-2xl text-gray-700">
            What we do:
          </h2>
          <div class="mt-2 space-y-3 pt-4 text-2xl leading-8 tracking-normal">
            <p>
              We are always here to lend a listening ear on for whatever you may
              be facing right now.
            </p>
            <p>Feel free to reach us through our Live Chat service.</p>
            <p> You may want to talk about:</p>
            <ul class="mt-4 list-inside list-disc space-y-2 text-2xl leading-8 tracking-normal">
              <li>Study stress</li>
              <li>Confusions</li>
              <li>Feeling lost/alone/empty</li>
              <li>Life challenges</li>
              <li>Anything that concerns you</li>
            </ul>
            <p class="pt-4 font-berkshire text-2xl font-bold">
              #You Share, We Care
            </p>
          </div>
        </div>
        <img
          class="absolute right-0 max-w-[650px]"
          src="/home/listening-ear.svg"
        />
      </div>

      <div class="mt-24 flex items-center justify-between">
        <div class="basis-[40%]">
          <img class="ml-auto max-w-[550px]" src="/home/no-judging.svg" />
        </div>
        <div class="basis-[40%]">
          <h2 class="mt-6 font-berkshire text-2xl text-gray-700">
            What To Expect:
          </h2>
          <div class="mt-2 space-y-3 pt-4 text-2xl leading-8 tracking-normal">
            <p>You are ensured that:</p>
            <ul class="mt-4 list-inside list-disc space-y-2 text-2xl leading-8 tracking-normal">
              <li>
                We <span class="font-semibold">don't judge</span>
              </li>
              <li>
                We <span class="font-semibold">won't tell you what to do</span>
              </li>
              <li>
                Everything is{" "}
                <span class="font-semibold">confidential and anonymous</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex justify-center px-24 py-20">
        <img class="max-w-[800px]" src="/home/paper-plane.svg" />
      </div>

      <div class="text-center">
        <h2 class="font-berkshire text-4xl text-gray-700">Get Connected</h2>
        <div class="font-print-clearly mt-8 space-y-4 text-3xl">
          <p>We would love to hear from you!</p>
          <p>
            For any enquiries and feedback, please get in touch with us via:
          </p>
        </div>
        <div class="mt-8 flex flex-col items-center gap-y-6">
          <SocialMedia
            icon={<IconInstagram class="h-8  text-red-600" />}
            text="@linehayat_usm"
            link="https://www.instagram.com/linehayat_usm"
          />
          <SocialMedia
            icon={<IconLinkedin class="h-8 text-blue-700" />}
            text="/linehayatusm"
            link="https://www.instagram.com/linehayat_usm"
          />
          <SocialMedia
            icon={<IconFacebook class="h-8 text-blue-500" />}
            text="/linehayat.usm"
            link="https://www.instagram.com/linehayat_usm"
          />
          <SocialMedia
            icon={<IconEmail class="h-8 text-black" />}
            text="@linehayat.usm.my"
            link="https://www.instagram.com/linehayat_usm"
          />
        </div>
      </div>

      <div class="mt-24 pb-24 text-center">
        <h2 class="font-berkshire text-4xl text-gray-700">
          Feedback to LineHayat
        </h2>
        <div class="font-print-clearly mx-auto max-w-[800px] px-12 pt-8 text-center text-2xl">
          <p>
            We are delighted to be able to help you in your most challenging
            time. If you have used our service, it would be wonderful to know
            your experience to provide better services in the future.
          </p>
          <p class="mt-4">
            Worry not, as we promise a completely confidential service, your
            comments would be anonymous.
          </p>
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSddwiLsi33C9DVywdAixOk2s7laSc91M7WXfpjYH2cLZtju2w/viewform"
          target="_blank"
          class="mx-auto mt-12 block w-fit rounded-full bg-red-200/80 px-16 py-4 text-xl uppercase shadow-o-lg"
        >
          FEEDBACK FORM
        </a>
      </div>
    </div>
  );
}

function SocialMedia(props: { icon: JSX.Element; text: string; link: string }) {
  return (
    <a target="_blank" href={props.link} class="flex w-[300px]">
      <div class="flex w-[80px] justify-end">{props.icon}</div>
      <div class="font-print-clearly flex w-[220px] items-center pl-6 text-left text-2xl hover:underline">
        {props.text}
      </div>
    </a>
  );
}
