import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Brain, Shield, Zap, TrendingUp, Clock, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Temporal Flow</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                  <Brain className="w-4 h-4 mr-2" />
                  AI-Powered Trading
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Master the Markets with{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Temporal Flow
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Revolutionary automated trading system that leverages advanced AI algorithms to analyze market
                  patterns, predict trends, and execute profitable trades 24/7.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Start Trading Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$2.4M+</div>
                  <div className="text-sm text-gray-600">Total Profits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">94.7%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="AI Trading Dashboard"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900">Why Choose Temporal Flow?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our cutting-edge technology gives you the competitive edge in today's fast-paced markets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Advanced machine learning algorithms analyze thousands of market indicators in real-time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Lightning Fast Execution</CardTitle>
                <CardDescription>
                  Execute trades in milliseconds with our high-frequency trading infrastructure.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Risk Management</CardTitle>
                <CardDescription>
                  Sophisticated risk controls and stop-loss mechanisms protect your investments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Comprehensive dashboards with live market data and performance metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle>24/7 Trading</CardTitle>
                <CardDescription>Never miss an opportunity with round-the-clock automated trading.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Expert Support</CardTitle>
                <CardDescription>
                  Dedicated support team and trading experts available when you need them.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="AI Trading Technology"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl"
              />
            </div>

            <div className="space-y-6">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                About Temporal Flow
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900">The Future of Automated Trading</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Temporal Flow represents the next evolution in algorithmic trading. Our proprietary AI models process
                vast amounts of market data, identifying patterns and opportunities that human traders might miss.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Built by a team of quantitative analysts, machine learning engineers, and trading veterans, our platform
                combines decades of market expertise with cutting-edge technology.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold text-purple-600">5+</div>
                  <div className="text-gray-600">Years of Development</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-gray-600">Trading Strategies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Ready to Transform Your Trading?</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of successful traders who trust Temporal Flow to maximize their profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Temporal Flow</span>
              </div>
              <p className="text-gray-400">Revolutionary automated trading system powered by advanced AI.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Temporal Flow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
