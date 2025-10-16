import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function OngoingProjectSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-purple-50 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Ongoing Project: South B 13-Floor Residential Tower
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We are proud to showcase our latest ongoing project: a modern 13-floor residential building located in
              South B. This ambitious development is designed to set new standards in urban living, blending
              architectural innovation with structural excellence.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-primary text-white px-6 py-3 text-base rounded-full">Location: South B</Badge>
            <Badge className="bg-accent text-white px-6 py-3 text-base rounded-full">Floors: 13</Badge>
            <Badge className="bg-green-600 text-white px-6 py-3 text-base rounded-full">Duration: 1.5 Years</Badge>
          </div>

          <p className="text-center text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            This project exemplifies our commitment to delivering high-rise residential solutions that combine comfort,
            safety, and contemporary design. The building will feature spacious apartments, advanced amenities, and
            sustainable construction practices.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <Card
                key={index}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={`/construction-site-worker-with-excavator-machinery-.jpg?height=400&width=600&query=construction site worker with excavator machinery ${index}`}
                      alt={`Construction progress ${index}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
