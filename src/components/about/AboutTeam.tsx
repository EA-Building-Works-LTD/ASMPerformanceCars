"use client";

import React from 'react';
import Image from 'next/image';
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

interface AboutTeamProps {
  title: string;
  subtitle?: string;
  members: TeamMember[];
}

// Type-safe motion components
type MotionDivProps = HTMLMotionProps<"div"> & React.HTMLAttributes<HTMLDivElement>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

export default function AboutTeam({
  title,
  subtitle,
  members,
}: AboutTeamProps) {
  // Function to render the appropriate social media icon
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-zinc-600 dark:text-zinc-300">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-50 dark:bg-zinc-900 rounded-lg overflow-hidden shadow-md"
            >
              {/* Member Image */}
              <div className="relative h-64 w-full">
                <Image
                  src={member.image || '/images/team-placeholder.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              
              {/* Member Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-zinc-900 dark:text-white">{member.name}</h3>
                <p className="text-red-600 font-medium mb-3">{member.role}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">{member.bio}</p>
                
                {/* Social Links */}
                {member.socialLinks && member.socialLinks.length > 0 && (
                  <div className="flex space-x-3">
                    {member.socialLinks.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                        aria-label={`${member.name}'s ${link.platform}`}
                      >
                        {renderSocialIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
} 