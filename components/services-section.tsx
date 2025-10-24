import { Card, CardContent } from "@/components/ui/card"
import { Code, BookOpen, GraduationCap } from "lucide-react"

const services = [
  {
    icon: Code,
    title: "Premium Plugins",
    description: "High-quality plugins to enhance your development workflow and productivity.",
  },
  {
    icon: BookOpen,
    title: "Expert E-books",
    description: "Comprehensive guides and tutorials written by industry experts.",
  },
  {
    icon: GraduationCap,
    title: "Online Courses",
    description: "Interactive courses to master new skills and advance your career.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer a wide range of digital products to enhance your skills and productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
