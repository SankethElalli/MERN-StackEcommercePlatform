import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Star, Truck, Shield, Headphones } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-12 md:py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <Badge variant="secondary" className="w-fit mx-auto lg:mx-0">
                New Collection Available
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Shop the Latest
                <span className="text-primary"> Fashion Trends</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
                Discover premium quality products at unbeatable prices. From fashion to electronics, we have everything
                you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-base px-8">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 bg-transparent">
                  View Collections
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/modern-ecommerce-hero.png"
                alt="Featured products"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Free Shipping</h3>
                <p className="text-muted-foreground">
                  Free shipping on orders over $50. Fast and reliable delivery worldwide.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure Payment</h3>
                <p className="text-muted-foreground">
                  Your payment information is processed securely with industry-standard encryption.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Get help whenever you need it with our round-the-clock customer support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Featured Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover our handpicked selection of trending products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={`/generic-product-display.png?height=300&width=300&query=product ${item} ecommerce`}
                      alt={`Product ${item}`}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3">New</Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg">Premium Product {item}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">(124)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-x-2">
                        <span className="text-xl font-bold">$99.99</span>
                        <span className="text-sm text-muted-foreground line-through">$129.99</span>
                      </div>
                      <Button size="sm">Add to Cart</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Start Shopping?</h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-pretty">
            Join thousands of satisfied customers and discover amazing deals on premium products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Browse All Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Sign Up for Deals
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
