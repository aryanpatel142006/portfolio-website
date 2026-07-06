import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="mt-4">
      <hr className="divider mb-8" />
      <div className="flex justify-center">
        <SocialLinks />
      </div>
    </footer>
  );
}
