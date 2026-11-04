"use client";

import { portfolio } from "@/data/portfolio";
import { ContactForm } from "./ContactForm";
import { ExtLink } from "./Content";
import { audio } from "@/lib/audio";

export function ContactBlock() {
  const { email, github, linkedin, leetcode, credly, resume, phone, location } = portfolio.links;
  return (
    <div className="stack">
      <ul className="contact-list">
        <li>
          <span>Email</span>
          <ExtLink href={email ? `mailto:${email}` : null}>{email ?? "Email address"}</ExtLink>
        </li>
        {phone && (
          <li>
            <span>Phone</span>
            <ExtLink href={`tel:${phone}`}>{phone}</ExtLink>
          </li>
        )}
        {location && (
          <li>
            <span>Location</span>
            <span>{location}</span>
          </li>
        )}
        <li>
          <span>GitHub</span>
          <ExtLink href={github}>github.com/premjeetcsesr</ExtLink>
        </li>
        <li>
          <span>LinkedIn</span>
          <ExtLink href={linkedin}>linkedin.com/in/premjeet-37804a2a9</ExtLink>
        </li>
        {leetcode && (
          <li>
            <span>LeetCode</span>
            <ExtLink href={leetcode}>leetcode.com/u/premjeet1918</ExtLink>
          </li>
        )}
        {credly && (
          <li>
            <span>Badges</span>
            <ExtLink href={credly}>Credly Certifications</ExtLink>
          </li>
        )}
        <li>
          <span>Résumé</span>
          <ExtLink href={resume} hint="Download Premjeet's Résumé PDF">
            Download résumé
          </ExtLink>
        </li>
      </ul>
      <ContactForm />
    </div>
  );
}

export function FinaleLinks({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="links links-center">
      <ExtLink href={portfolio.links.github}>Explore GitHub</ExtLink>
      <ExtLink href={portfolio.links.linkedin}>Connect on LinkedIn</ExtLink>
      <ExtLink href={portfolio.links.leetcode}>LeetCode Profile</ExtLink>
      <ExtLink href={portfolio.links.resume}>Download Résumé</ExtLink>
      <button
        type="button"
        className="btn"
        onClick={() => {
          audio.tick();
          onReplay();
        }}
      >
        Back to the beginning
      </button>
    </div>
  );
}
