import Image from "next/image";
export default async function Main() {
  return (
    <div className="px-12 flex flex-col md:flex-row gap-11 justify-between max-w-[1000px] mt-10 mx-auto">
      <h1 className="flex justify-center items-center text-5xl text-center font-bold">
        Coming Soon ...
      </h1>
      <Image
        className="md:max-w-[50%] rounded-lg shadow-2xl"
        src={"/landing.png"}
        alt="image"
        width={1024}
        height={1024}
      />
    </div>
  );
}
