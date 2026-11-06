import CoreGraphics
import CryptoKit
import Foundation

let output = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
  .appendingPathComponent("documentation/assets/fontawesome/packages")

func polygon(_ points: [(CGFloat, CGFloat)]) -> CGPath {
  let path = CGMutablePath()
  path.move(to: CGPoint(x: points[0].0, y: points[0].1))
  for (x, y) in points.dropFirst() { path.addLine(to: CGPoint(x: x, y: y)) }
  path.closeSubpath()
  return path
}

func rect(_ x: CGFloat, _ y: CGFloat, _ width: CGFloat, _ height: CGFloat, radius: CGFloat = 0)
  -> CGPath
{
  CGPath(
    roundedRect: CGRect(x: x, y: y, width: width, height: height),
    cornerWidth: radius, cornerHeight: radius, transform: nil)
}

func circle(_ x: CGFloat, _ y: CGFloat, _ radius: CGFloat) -> CGPath {
  CGPath(
    ellipseIn: CGRect(x: x - radius, y: y - radius, width: radius * 2, height: radius * 2),
    transform: nil)
}

func stroke(_ points: [(CGFloat, CGFloat)], _ width: CGFloat) -> CGPath {
  let path = CGMutablePath()
  path.move(to: CGPoint(x: points[0].0, y: points[0].1))
  for (x, y) in points.dropFirst() { path.addLine(to: CGPoint(x: x, y: y)) }
  return path.copy(strokingWithWidth: width, lineCap: .round, lineJoin: .round, miterLimit: 10)
}

func union(_ paths: [CGPath]) -> CGPath {
  paths.dropFirst().reduce(paths[0]) { $0.union($1, using: .winding) }
}

func core() -> CGPath {
  let top = polygon([(12, 23), (32, 12), (52, 23), (32, 34)])
    .subtracting(polygon([(24, 23), (32, 18.5), (40, 23), (32, 27.5)]), using: .winding)
  return union([
    top,
    polygon([(12, 28), (32, 39), (52, 28), (52, 33), (32, 44), (12, 33)]),
    polygon([(12, 36), (32, 47), (52, 36), (52, 42), (32, 53), (12, 42)]),
  ])
}

func maintainer() -> CGPath {
  stroke([(16, 45), (16, 20), (32, 36), (48, 20), (48, 45)], 6)
}

func mosaicast() -> CGPath {
  let center = CGMutablePath()
  center.move(to: CGPoint(x: 24, y: 20))
  center.addCurve(
    to: CGPoint(x: 26.6, y: 19), control1: CGPoint(x: 24, y: 18.6),
    control2: CGPoint(x: 25.6, y: 18))
  center.addLine(to: CGPoint(x: 32, y: 25))
  center.addLine(to: CGPoint(x: 37.4, y: 19))
  center.addCurve(
    to: CGPoint(x: 40, y: 20), control1: CGPoint(x: 38.4, y: 18), control2: CGPoint(x: 40, y: 18.6))
  center.addLine(to: CGPoint(x: 40, y: 27))
  center.addLine(to: CGPoint(x: 32, y: 36))
  center.addLine(to: CGPoint(x: 24, y: 27))
  center.closeSubpath()
  return union([
    rect(13, 17, 8, 14, radius: 2), rect(13, 34, 8, 13, radius: 2),
    rect(43, 17, 8, 14, radius: 2), rect(43, 34, 8, 13, radius: 2), center,
  ])
}

func qztray() -> CGPath {
  let body = CGMutablePath()
  body.move(to: CGPoint(x: 20, y: 22))
  body.addCurve(
    to: CGPoint(x: 26, y: 16), control1: CGPoint(x: 20, y: 18.686),
    control2: CGPoint(x: 22.686, y: 16))
  body.addLine(to: CGPoint(x: 45, y: 16))
  body.addCurve(
    to: CGPoint(x: 51, y: 22), control1: CGPoint(x: 48.314, y: 16),
    control2: CGPoint(x: 51, y: 18.686))
  body.addLine(to: CGPoint(x: 51, y: 33))
  body.addCurve(
    to: CGPoint(x: 47, y: 37), control1: CGPoint(x: 51, y: 35.209),
    control2: CGPoint(x: 49.209, y: 37))
  body.addLine(to: CGPoint(x: 24, y: 37))
  body.addCurve(
    to: CGPoint(x: 20, y: 33), control1: CGPoint(x: 21.791, y: 37),
    control2: CGPoint(x: 20, y: 35.209))
  body.closeSubpath()
  let paper = polygon([
    (26.5, 30), (44.5, 30), (44.5, 48.5), (41.5, 46.5), (38.5, 48.5),
    (35.5, 46.5), (32.5, 48.5), (29.5, 46.5), (26.5, 48.5),
  ])
  let housing = union([body, stroke([(9, 24), (21, 24)], 2.5), rect(11, 21, 7, 6, radius: 1.5)])
    .subtracting(
      union([circle(44.5, 22.5, 1.5), rect(24, 27.5, 23, 4, radius: 2), rect(25, 30, 21, 9)]),
      using: .winding)
  return housing.union(paper, using: .winding)
    .subtracting(
      union([
        rect(30.5, 34.5, 2, 8), rect(34, 34.5, 1.5, 8), rect(37, 34.5, 2.5, 8),
        rect(41, 34.5, 1, 8),
      ]), using: .winding)
}

func dumpToConsole() -> CGPath {
  let frame = rect(11, 15, 42, 34, radius: 6).subtracting(
    union([
      rect(14, 23, 36, 23, radius: 3), circle(17.5, 19, 1.25), circle(22, 19, 1.25),
      circle(26.5, 19, 1.25),
    ]), using: .winding)
  return union([
    frame, stroke([(20, 29), (26, 34.5), (20, 40)], 3.5), stroke([(32, 40), (42, 40)], 3),
  ])
}

func frontAwesome() -> CGPath {
  let ruler = CGMutablePath()
  ruler.move(to: CGPoint(x: 13, y: 18))
  ruler.addArc(
    center: CGPoint(x: 16, y: 18), radius: 3, startAngle: .pi, endAngle: 1.5 * .pi, clockwise: false
  )
  ruler.addLine(to: CGPoint(x: 44, y: 15))
  ruler.addArc(
    center: CGPoint(x: 44, y: 17), radius: 2, startAngle: 1.5 * .pi, endAngle: 2.25 * .pi,
    clockwise: false)
  ruler.addLine(to: CGPoint(x: 16.414, y: 47.414))
  ruler.addArc(
    center: CGPoint(x: 15, y: 46), radius: 2, startAngle: 0.25 * .pi, endAngle: .pi,
    clockwise: false)
  ruler.closeSubpath()
  let ticks = union([
    stroke([(13, 25), (16, 25)], 1.5), stroke([(13, 31), (17, 31)], 1.5),
    stroke([(13, 37), (16, 37)], 1.5), stroke([(23, 15), (23, 18)], 1.5),
    stroke([(29, 15), (29, 18)], 1.5),
  ])
  let clearance = union([
    stroke([(38, 12), (38, 18)], 8), stroke([(37, 25), (31, 43), (27, 50)], 8),
    stroke([(39, 25), (47, 42), (51, 50)], 8), stroke([(34, 37), (45, 37)], 8), circle(38, 21.5, 6),
  ])
  let setSquare = ruler.subtracting(
    union([polygon([(20, 22), (20, 35), (33, 22)]), ticks, clearance]), using: .winding)
  let compass = union([
    stroke([(38, 12), (38, 18)], 3.5),
    polygon([(34.5, 22.5), (39.5, 24), (33, 43), (27, 51), (28.5, 42)]),
    polygon([(37.5, 24), (42, 22), (50.5, 42.5), (51, 51), (46, 44)]),
    stroke([(33, 37), (46, 37)], 2), rect(37.5, 34.5, 4, 5, radius: 1), circle(38, 21.5, 4.75),
  ])
  .subtracting(circle(38, 21.5, 1.5), using: .winding)
  func sparkle(_ x: CGFloat, _ y: CGFloat, _ radius: CGFloat) -> CGPath {
    let p = CGMutablePath()
    p.move(to: CGPoint(x: x, y: y - radius))
    p.addQuadCurve(
      to: CGPoint(x: x + radius, y: y), control: CGPoint(x: x + radius * 0.12, y: y - radius * 0.12)
    )
    p.addQuadCurve(
      to: CGPoint(x: x, y: y + radius), control: CGPoint(x: x + radius * 0.12, y: y + radius * 0.12)
    )
    p.addQuadCurve(
      to: CGPoint(x: x - radius, y: y), control: CGPoint(x: x - radius * 0.12, y: y + radius * 0.12)
    )
    p.addQuadCurve(
      to: CGPoint(x: x, y: y - radius), control: CGPoint(x: x - radius * 0.12, y: y - radius * 0.12)
    )
    p.closeSubpath()
    return p
  }
  return union([
    setSquare, compass, sparkle(51, 23.3, 3.3), sparkle(21, 50.2, 2.2), circle(54, 30, 1),
    circle(16, 53, 1),
  ])
}

func number(_ value: CGFloat) -> String {
  let rounded = (value * 1000).rounded() / 1000
  return String(format: "%.3f", rounded).replacingOccurrences(
    of: #"\.?0+$"#, with: "", options: .regularExpression)
}

let icons: [(String, CGPath)] = [
  ("core", core()), ("maintainer", maintainer()), ("mosaicast", mosaicast()),
  ("qztray", qztray()), ("dump-to-console", dumpToConsole()), ("front-awesome", frontAwesome()),
]
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
var provenance: [[String: String]] = []
for (name, path) in icons {
  let normalized = path.normalized(using: .winding)
  let bounds = normalized.boundingBoxOfPath
  let scale = 512 / bounds.height
  let width = ceil(bounds.width * scale)
  var transform = CGAffineTransform(
    a: scale, b: 0, c: 0, d: scale, tx: -bounds.minX * scale + (width - bounds.width * scale) / 2,
    ty: -bounds.minY * scale)
  let scaled = normalized.copy(using: &transform)!
  var commands: [String] = []
  scaled.applyWithBlock { pointer in
    let e = pointer.pointee
    func point(_ i: Int) -> String { number(e.points[i].x) + " " + number(e.points[i].y) }
    switch e.type {
    case .moveToPoint: commands.append("M" + point(0))
    case .addLineToPoint: commands.append("L" + point(0))
    case .addQuadCurveToPoint: commands.append("Q" + point(0) + " " + point(1))
    case .addCurveToPoint: commands.append("C" + point(0) + " " + point(1) + " " + point(2))
    case .closeSubpath: commands.append("Z")
    @unknown default: fatalError("Unsupported path element")
    }
  }
  let svg =
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 \(Int(width)) 512\"><path fill=\"#000000\" d=\"\(commands.joined())\"/></svg>\n"
  try svg.write(to: output.appendingPathComponent(name + ".svg"), atomically: true, encoding: .utf8)
  let sourcePath = "public/images/packages/\(name)/\(name)-icon.svg"
  let root = output.deletingLastPathComponent().deletingLastPathComponent()
    .deletingLastPathComponent().deletingLastPathComponent()
  let source = try Data(contentsOf: root.appendingPathComponent(sourcePath))
  func digest(_ data: Data) -> String {
    SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
  }
  provenance.append([
    "id": name, "source": sourcePath, "sourceSha256": digest(source),
    "artifactSha256": digest(Data(svg.utf8)),
  ])
  print("\(name): \(Int(width)) × 512")
}
let entries = provenance.map { entry in
  let fields = entry.sorted { $0.key < $1.key }.map { field in
    "        \"\(field.key)\": \"\(field.value)\""
  }.joined(separator: ",\n")
  return "    {\n" + fields + "\n    }"
}.joined(separator: ",\n")
try ("[\n" + entries + "\n]\n").write(
  to: output.appendingPathComponent("sources.json"), atomically: true, encoding: .utf8)
