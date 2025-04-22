import { motion } from "framer-motion";
import { 
  Linkedin, 
  Twitter, 
  Instagram, 
  Globe 
} from "lucide-react";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const socialLinks = [
    { icon: <Linkedin size={20} />, url: "https://linkedin.com", ariaLabel: "LinkedIn Profile" },
    { icon: <Twitter size={20} />, url: "https://twitter.com", ariaLabel: "Twitter Profile" },
    { icon: <Instagram size={20} />, url: "https://instagram.com", ariaLabel: "Instagram Profile" },
    { icon: <Globe size={20} />, url: "https://example.com", ariaLabel: "Personal Website" }
  ];

  const skills = [
    "JavaScript", "Python", "React", "Node.js", 
    "TensorFlow", "Cloud Architecture", "UI/UX Design"
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      <motion.h2 
        variants={itemVariants}
        className="font-space font-bold text-3xl mb-8 text-secondary"
      >
        About Me
      </motion.h2>
      
      <motion.div 
        variants={itemVariants}
        className="gradient-bg rounded-xl shadow-lg p-8"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <div className="rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c" 
                alt="Profile" 
                className="w-full object-cover"
              />
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="bg-primary hover:bg-secondary transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center text-white"
                  whileHover={{ y: -3 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-8">
            <h3 className="font-space font-bold text-2xl mb-4">
              Hey, I'm <span className="text-secondary">Alex Chen</span>
            </h3>
            
            <div className="prose prose-invert max-w-none">
              <p className="mb-4">
                I'm a technology enthusiast, software developer, and occasional blogger based in Seattle. 
                With over 12 years of experience in the tech industry, I've worked across various domains 
                from web development to machine learning applications.
              </p>
              
              <p className="mb-4">
                My journey in technology started when I was just 14, tinkering with HTML and CSS to create 
                my first website. That early fascination evolved into a computer science degree and eventually 
                a career spanning startups and Fortune 500 companies.
              </p>
              
              <p className="mb-4">
                When I'm not coding or writing about tech, you'll find me hiking the Pacific Northwest trails, 
                experimenting with specialty coffee brewing methods, or playing jazz piano—activities that help 
                me maintain perspective and creativity in my technical work.
              </p>
              
              <p className="mb-4">
                This blog is my digital playground where I share insights on emerging technologies, development 
                practices, and occasional philosophical musings on where our digital future is heading. My writing 
                style aims to make complex technical concepts accessible without oversimplifying them.
              </p>
              
              <p>
                I believe in technology that serves human needs and enhances our capabilities rather than 
                technology for its own sake. This perspective guides both my professional work and the content 
                I create for this blog.
              </p>
            </div>
            
            <div className="mt-8">
              <h4 className="font-space font-medium text-xl mb-4">Technical Expertise</h4>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span 
                    key={index}
                    className="text-sm px-3 py-1 rounded-full bg-primary text-foreground"
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default About;
