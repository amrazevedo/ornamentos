// GERADO por scripts/gen-default-scad.mjs a partir de ornamentos/ornamentos_redondos.scad — não editar à mão.
export default `// =====================================================================
//  Ornamentos de Natal redondos (Ø ~75 mm) com nome — 2 cores
//  Cor A: aro + decoração + base do nome   (0 → altura_ornamento)
//  Cor B: só o nome, com offset negativo   (altura_ornamento → +altura_nome)
//  OpenSCAD ≥ 2021.01 · Customizer · fontes Google (Pacifico por omissão)
// =====================================================================

/* [Personalização] */
nome = "Gabriel";
// Modelo (Forma, Sleek, Cena ou Importado — os importados precisam do molduras_importadas.scad)
design = "coroa"; // [sino_f:Forma - sino, casa:Forma - casinha, bengala:Forma - bengala, estrela:Forma - estrela, gorro:Forma - gorro do Pai Natal, meia:Forma - meia, presente:Forma - presente, boneco:Forma - boneco de neve, coroa:Sleek - coroa de folhas, lua:Sleek - lua e estrelas, floco:Sleek - floco de neve, linha:Sleek - árvore em linha, montanhas:Cena - montanhas e pinheiros, azevinho:Cena - pinho sino e estrela, laco:Cena - laço coração e poinsétia, rena:Cena - rena bagas e estrela, lev_montanhas:Importado - montanhas, lev_rena:Importado - rena, lev_laco:Importado - laço e poinsétia, lev_sino:Importado - sino e pinho, lev_pata:Importado - pata]
// Fonte cursiva (letras ligadas). Pacifico/Lobster/Grand Hotel/Damion: robustas
fonte = "Pacifico"; // [Pacifico, Satisfy, Dancing Script Bold, Lobster, Grand Hotel, Damion, Cookie, Norican, Yellowtail]
// Tamanho (mm): diâmetro do aro; nas formas é a escala equivalente
diametro = 75; // [60:1:100]

/* [Alturas e offsets] */
altura_ornamento = 3.0; // [1.6:0.2:6]
altura_nome = 1.0;      // [0.4:0.2:3]
// Offset do nome de topo (negativo = mais fino que a base)
offset_nome = -0.3;     // [-1:0.05:0]
// Contorno da base do nome (cor A)
contorno_nome = 1.0;    // [0:0.1:3]
// Une pontos/acentos às letras na base (preenche folgas até 2× este valor)
uniao_letras = 2.0;     // [0:0.25:4]

/* [Exportação] */
parte = "tudo"; // [tudo, base, nome]
cor_base = "#1F5C3A";
cor_nome = "#F4F1EA";

/* [Hidden] */
$fn = 48;
k  = diametro / 75;      // toda a decoração é desenhada num ornamento de 75 mm
RO = 37.5;               // raio exterior (espaço 75 mm)
include <molduras_importadas.scad>   // molduras importadas do 3MF (ficheiro ao lado deste)
IMPORT = design == "lev_montanhas" || design == "lev_rena" || design == "lev_laco" || design == "lev_sino" || design == "lev_pata";
FORMA = design == "sino_f" || design == "casa" || design == "bengala" || design == "estrela" || design == "gorro" || design == "meia" || design == "presente" || design == "boneco";
SLEEK = design == "coroa" || design == "lua" || design == "floco" || design == "linha";
RI = RO - (SLEEK ? 2.2 : 3);  // raio interior (aro de 2,2 mm nos designs sleek, 3 mm nas cenas)
LUA_C = [5.5, 4.5]; LUA_R = 28.5;   // círculo que recorta a lua

// ---------------------------------------------------------------------
// Curvas e traços
// ---------------------------------------------------------------------
function dir(a) = [cos(a), sin(a)];
function arco(r, a0, a1, n = 24) = [for (i = [0 : n]) let(a = a0 + (a1 - a0) * i / n) r * dir(a)];
function bez3(p0, p1, p2, p3, n = 16) =
    [for (i = [0 : n]) let(t = i / n) pow(1 - t, 3) * p0 + 3 * pow(1 - t, 2) * t * p1 + 3 * (1 - t) * t * t * p2 + pow(t, 3) * p3];
function bez2(p0, p1, p2, n = 12) = [for (i = [0 : n]) let(t = i / n) pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + t * t * p2];
// Catmull-Rom: curva suave que passa pelos pontos P
function cr(P, n = 8) = concat(
    [for (i = [0 : len(P) - 2], j = [0 : n - 1])
        let(p0 = P[max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[min(i + 2, len(P) - 1)], t = j / n)
        0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t)],
    [P[len(P) - 1]]);
function crc(P, n = 8) =   // Catmull-Rom fechada
    [for (i = [0 : len(P) - 1], j = [0 : n - 1])
        let(L = len(P), p0 = P[(i - 1 + L) % L], p1 = P[i], p2 = P[(i + 1) % L], p3 = P[(i + 2) % L], t = j / n)
        0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t)];
function espelho(R) = concat(R, [for (i = [len(R) - 2 : -1 : 1]) [-R[i][0], R[i][1]]]);
function rev(L) = [for (i = [len(L) - 1 : -1 : 0]) L[i]];

module traco(p, w, w2 = -1) {               // traço com espessura w → w2
    ww = w2 < 0 ? w : w2;
    for (i = [0 : len(p) - 2])
        hull() {
            translate(p[i])     circle(d = w + (ww - w) * i / (len(p) - 1), $fn = 14);
            translate(p[i + 1]) circle(d = w + (ww - w) * (i + 1) / (len(p) - 1), $fn = 14);
        }
}
module laco_fechado(P, w) traco(concat(P, [P[0]]), w);
module suavizar(r = 0.4) offset(r = -r) offset(r = 2 * r) offset(r = -r) children();
module arredondar(r) offset(r = r) offset(delta = -r) children();

// ---------------------------------------------------------------------
// Motivos
// ---------------------------------------------------------------------
// brilho de lados côncavos (astroide); k maior = braços mais finos
module brilho(R, k = 3)
    polygon([for (t = [0 : 4 : 356]) let(c = cos(t), s = sin(t))
        R * [sign(c) * pow(abs(c), k), sign(s) * pow(abs(s), k)]]);
module estrela_guia(R) { brilho(R, 3.4); rotate(45) brilho(R * 0.52, 3.2); circle(R * 0.13); }

module estrela_curva(R, n = 5)              // estrela de 5 pontas com lados curvos
    polygon(crc([for (i = [0 : 2 * n - 1]) (i % 2 == 0 ? R : R * 0.5) * dir(90 + i * 180 / n)], 4));

module floco(R, w = 1.2) {
    for (a = [0 : 60 : 300]) rotate(a + 90) {
        traco([[0, 0], [R, 0]], w, w * 0.85);
        for (f = [0.45, 0.72]) for (s = [-1, 1])
            traco([[R * f, 0], [R * f + R * 0.22, s * R * 0.22]], w * 0.85, w * 0.7);
    }
    circle(w * 1.1);
}

module folha_c(L, W, b = 0.12)              // folha curva, base em (0,0) → +x
    polygon(concat(
        bez3([0, 0], [0.3 * L, 0.75 * W + 0.3 * b * L], [0.72 * L, 0.5 * W + 0.9 * b * L], [L, b * L]),
        bez3([L, b * L], [0.72 * L, -0.5 * W + 0.9 * b * L], [0.3 * L, -0.75 * W + 0.3 * b * L], [0, 0])));

module folha_azevinho(L, W, b = 0.1) {      // folha recortada com 3 bicos por lado
    rc = L * 0.11;
    difference() {
        folha_c(L, W, b);
        for (t = [0.27, 0.49, 0.71], sg = [-1, 1]) let(e = W * 0.5 * pow(sin(180 * t), 0.6))
            translate([L * t, sg * (e + rc * 0.2) + b * L * t * (1.6 - t)]) circle(r = rc, $fn = 28);
    }
}

module pinheiro(h, w, n = 4) {              // andares curvos, base em y=0
    th = h * 0.13; H = h - th;
    for (i = [0 : n - 1]) let(
            yb = h - (i + 1) * H / n,
            ht = (i == 0 ? 1.0 : 1.55) * H / n,
            yt = yb + ht,
            wi = w / 2 * (0.42 + 0.58 * (i + 1) / n),
            R = concat(
                bez3([0, yt], [wi * 0.42, yt - ht * 0.12], [wi * 0.92, yb + ht * 0.48], [wi * 1.04, yb - ht * 0.02], 12),
                bez3([wi * 1.04, yb - ht * 0.02], [wi * 0.75, yb + ht * 0.02], [wi * 0.4, yb + ht * 0.22], [0, yb + ht * 0.16], 12)))
        polygon(concat(R, [for (j = [len(R) - 2 : -1 : 1]) [-R[j][0], R[j][1]]]));
    translate([0, th / 2]) arredondar(0.5) square([max(1.8, w * 0.15), th + 4], center = true);
}

module ramo_pinho(P, L = 5.2, passo = 3, w = 1.9) {   // caule curvo + agulhas curvas afiladas
    C = cr(P, 6);
    traco(C, w, w * 0.75);
    for (i = [1 : passo : len(C) - 2]) let(d = C[i + 1] - C[i - 1], a = atan2(d[1], d[0]),
                                          f = 1 - 0.45 * i / len(C))
        for (s = [-1, 1]) let(p0 = C[i], p2 = p0 + L * f * dir(a + s * 42))
            traco(bez2(p0, p0 + L * f * 0.55 * dir(a + s * 58), p2, 5), 1.3, 0.9);
}

module ramo_folhas(P, L = 7.5, W = 3.4) {   // caule curvo + folhas alternadas
    C = cr(P, 6);
    traco(C, 1.8, 1.2);
    for (i = [3 : 5 : len(C) - 3]) let(d = C[i + 1] - C[i - 1], a = atan2(d[1], d[0]),
                                      s = (floor(i / 5) % 2 == 0) ? 1 : -1)
        translate(C[i]) rotate(a + s * 40) folha_c(L * (1 - 0.25 * i / len(C)), W, -s * 0.14);
    let(e = C[len(C) - 1], d = e - C[len(C) - 3]) translate(e) rotate(atan2(d[1], d[0])) folha_c(L * 0.8, W * 0.9, 0.05);
}

module bagas(c, r = 1.6) for (q = [[0, 0], [2.4, 1.3], [0.4, 2.7]]) translate(c + q * r / 1.6) circle(r);

module espiral(c, r0, voltas, a0, sentido = 1, w0 = 1.7, w1 = 1.0)
    traco([for (i = [0 : 48]) let(t = i / 48) c + r0 * (1 - 0.78 * t) * dir(a0 + sentido * 360 * voltas * t)], w0, w1);

module coracao(s) let(R = concat(bez3([0, -0.6 * s], [0.5 * s, -0.12 * s], [0.66 * s, 0.4 * s], [0.28 * s, 0.45 * s], 10),
                                  bez3([0.28 * s, 0.45 * s], [0.1 * s, 0.47 * s], [0.02 * s, 0.32 * s], [0, 0.2 * s], 6)))
    polygon(concat(R, [for (i = [len(R) - 2 : -1 : 1]) [-R[i][0], R[i][1]]]));

module bola_mini(r) { circle(r); translate([0, r * 0.95]) arredondar(0.4) square([r * 0.8, r * 0.5], center = true);
                      translate([0, r * 1.25]) difference() { circle(r * 0.32); circle(r * 0.14, $fn = 12); } }

module sino() {                               // topo em (0,0), ~12 mm
    R = cr([[0, 0.2], [1.9, -0.4], [3.2, -2.4], [3.6, -5.2], [4.2, -8], [5.4, -9.8], [6.3, -10.7]], 5);
    B = bez2([6.3, -10.7], [3, -11.5], [0, -11.3], 8);
    P = concat(R, B);
    difference() {
        polygon(concat(P, [for (i = [len(P) - 2 : -1 : 1]) [-P[i][0], P[i][1]]]));
        traco(bez2([-2.5, -8.0], [0, -8.7], [2.5, -8.0], 8), 0.9);
    }
    translate([0, -11.9]) circle(1.5);
}

module laco() {                               // centro do nó em (0,0)
    for (m = [0, 1]) mirror([m, 0]) {
        laco_fechado(crc([[-1.5, 0.6], [-5, 3.6], [-10, 5], [-13, 2.6], [-12.4, -1.2], [-8.6, -2.6], [-4.2, -1.2]], 6), 2.2);
        traco(cr([[-1.4, -1.8], [-3.6, -5.5], [-3.8, -9], [-6, -12.5]], 6), 2.9, 2.0);
    }
    arredondar(1.2) square([5.6, 6.2], center = true);
}

module poinsetia() {
    difference() {
        union() {
            for (i = [0 : 4]) rotate(90 + i * 72)      folha_c(10.5, 4.6, 0.1);
            for (i = [0 : 4]) rotate(90 + 36 + i * 72) folha_c(7, 3.4, -0.1);
            circle(2.6);
        }
        for (i = [0 : 2]) rotate(90 + i * 120) translate([1.15, 0]) circle(0.6, $fn = 10);
    }
}

module rena() {                               // cascos em y=0, virada para a direita
    hull() { translate([-5, 9]) circle(3.1); translate([1, 9.2]) circle(3.2); translate([5, 9.8]) circle(3.3); }
    traco(cr([[4.6, 11], [6.6, 13.6], [8.2, 16.4]], 4), 3.3, 2.7);                  // pescoço
    hull() { translate([8.7, 17]) circle(2); translate([11.9, 15.5]) circle(1.05); }
    traco(bez2([7.6, 18.3], [6.4, 19.6], [5.4, 19.4], 4), 1.5, 1.0);               // orelha
    traco(cr([[6.3, 7.5], [7.1, 4.4], [6.4, 1.8], [6.8, 0]], 4), 1.7, 1.4);          // patas
    traco(cr([[3.2, 7.5], [2.5, 4.2], [3.1, 1.6], [2.8, 0]], 4), 1.7, 1.4);
    traco(cr([[-3.3, 7.5], [-2.7, 4], [-3.4, 1.6], [-3.1, 0]], 4), 1.8, 1.4);
    traco(cr([[-6.9, 7.5], [-8.1, 4.2], [-7.2, 1.6], [-7.5, 0]], 4), 1.8, 1.4);
    traco(bez2([-7.8, 10.5], [-9, 11.6], [-9.4, 12.4], 4), 1.6, 1.0);              // cauda
    traco(cr([[8.4, 18.6], [7.4, 21.2], [5.6, 23.4], [3.6, 24.4]], 5), 1.4, 1.0); // hastes
    traco(bez2([7.3, 21.4], [8.6, 22.4], [9, 24], 4), 1.2, 0.9);
    traco(bez2([5.8, 23.2], [5.6, 24.8], [6.4, 26], 4), 1.1, 0.9);
    traco(cr([[9.6, 18.6], [10.8, 21.4], [10.8, 24.2], [9.8, 26.2]], 5), 1.4, 1.0);
    traco(bez2([10.8, 21.6], [12.4, 22], [13.2, 23.4], 4), 1.2, 0.9);
}

module raminho(a, giro = 0, r = 29) {        // azevinho: caule preso ao aro, 2 folhas + 3 bagas
    c = r * dir(a); ai = a + 180 + giro;
    traco(bez2(36 * dir(a), (36 + r) / 2 * dir(a) + 1.5 * dir(a + 90), c, 6), 2.0, 1.5);
    for (sg = [-1, 1]) translate(c) rotate(ai + sg * 42) folha_azevinho(11.5, 5.4, sg * 0.1);
    for (q = [[0, 0], [1.9, 1.5], [-0.3, 2.4]]) translate(c + [q[0] * cos(ai) - q[1] * sin(ai), q[0] * sin(ai) + q[1] * cos(ai)] * 0.9) circle(1.55);
}

module espiral_folhas(c, r0, voltas, a0, sentido = 1) {
    espiral(c, r0, voltas, a0, sentido, 2.0, 1.35);
    let(p0 = c + r0 * dir(a0)) traco(bez2(p0 * 36 / norm(p0), p0 * 35 / norm(p0) + 1.5 * dir(a0 + 90 * sentido), p0, 6), 2.0);   // liga ao aro
    for (t = [0.12, 0.36]) let(a = a0 + sentido * 360 * voltas * t, p = c + r0 * (1 - 0.78 * t) * dir(a))
        translate(p) rotate(a + sentido * 60) folha_c(6.2 * (1 - 0.4 * t), 3, -sentido * 0.15);
}

module chao(P)  polygon(concat(cr(P, 6), [[40, -60], [-40, -60]]));
module colina(P, w = 2.3) difference() { chao(P); offset(r = -w) chao(P); }
// cordilheira: encostas ligeiramente côncavas entre pontos-chave
function cume(K) = concat([for (i = [0 : len(K) - 2], q = [0 : 7])
    let(A = K[i], B = K[i + 1], M = (A + B) / 2 - [0, 0.13 * norm(B - A)], t = q / 8)
        pow(1 - t, 2) * A + 2 * (1 - t) * t * M + t * t * B], [K[len(K) - 1]]);
module serra(K) polygon(concat(cume(K), [[40, -60], [-40, -60]]));

// ---------------------------------------------------------------------
// Cenas (espaço de 75 mm). Tudo o que fica dentro do aro é recortado.
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// FORMAS (silhueta cheia; a moldura é o contorno com PF mm de espessura)
// ---------------------------------------------------------------------
PF = 2.4;
function caixa(x0, y0, x1, y1) = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
module ret(x0, y0, x1, y1, r = 2) arredondar(r) polygon(caixa(x0, y0, x1, y1));
function sino_perfil() = let(R = cr([[0, 31], [9, 30], [16, 26], [20, 18], [22, 8], [23.5, -2], [26, -11], [30, -18], [34, -23], [36, -26]], 6),
                             L = bez2([36, -26], [18, -31], [0, -29.5], 10), P = concat(R, L))
    concat(P, [for (i = [len(P) - 2 : -1 : 1]) [-P[i][0], P[i][1]]]);
BENG = concat([[16, -31]], [for (p = arco(16, 0, 180, 40)) p + [0, 14]], [[-16, 6]]);
module gorro_banda() union() {
    ret(-31, -34, 31, -14, 7);
    for (x = [-26 : 6.5 : 26]) { translate([x, -14.2]) circle(3.0); translate([x + 3.2, -33.8]) circle(3.0); }
}
GORRO_CORPO = [[-25, -15], [-22, -2], [-15, 12], [-4, 22], [8, 28], [18, 29.5], [25, 26], [26, 21], [21, 19], [16, 15], [13, 8], [16, -4], [24, -15]];
module pompom(c, r) { translate(c) circle(r); for (a = [0 : 40 : 320]) translate(c + r * dir(a)) circle(r * 0.32); }
MEIA_PE = [[-19, 18], [-19, -8], [-21, -20], [-17, -30], [-7, -35], [10, -36], [24, -34], [32, -27], [30, -19], [20, -14], [13, -10], [13, 18]];

module forma(d) {
    if (d == "sino_f") polygon(sino_perfil());
    else if (d == "casa") arredondar(1.5) union() {
        polygon(caixa(-26, -34, 26, 4));
        polygon([[-34, 2], [34, 2], [0, 32]]);
        polygon(caixa(13, 14, 21, 30));
    }
    else if (d == "bengala") traco(BENG, 19);
    else if (d == "estrela") arredondar(3.5) polygon([for (i = [0 : 9]) (i % 2 == 0 ? 39 : 19.5) * dir(90 + 36 * i)]);
    else if (d == "gorro") union() { gorro_banda(); polygon(crc(GORRO_CORPO, 6)); pompom([26, 23], 6.5); }
    else if (d == "meia") union() { ret(-24, 16, 20, 36, 4); polygon(crc(MEIA_PE, 6)); }
    else if (d == "presente") union() { ret(-27, -36, 27, 6, 2.5); ret(-31, 4, 31, 15, 2.5); }
    else if (d == "boneco") union() { translate([0, -15]) circle(22); translate([0, 14.5]) circle(12.5); }
}

module cena_forma(d) {
    if (d == "sino_f") {
        traco(bez2([-36, -19], [0, -25.5], [36, -19], 16), 1.5);
        traco(bez2([-34, -14], [0, -20], [34, -14], 16), 1.5);
        for (x = [-18 : 6 : 18]) let(t = (x + 36) / 72, y = pow(1 - t, 2) * -19 + 2 * (1 - t) * t * -25.5 + t * t * -19) translate([x, y]) circle(1.5);
        traco(bez2([-17.6, 19], [-21, 9], [-19.4, -1], 10), 1.6, 1.0);              // brilho
        for (sg = [-1, 1]) translate([0, 26]) rotate(sg == 1 ? -22 : 202) folha_azevinho(10.5, 5, -0.1);
        for (q = [[0, 27.6], [-1.9, 26], [1.9, 26]]) translate(q) circle(1.6);
    }
    else if (d == "casa") {
        traco([[-36, 3], [36, 3]], 2.0);
        for (x = [-30 : 5 : 30]) translate([x, 1.6]) circle(2.1);                     // glacé
        traco(concat([[-6, -36]], [for (p = arco(6, 180, 0, 16)) p + [0, -22]], [[6, -36]]), 1.5);  // porta
        translate([4.7, -28]) circle(1.1);
        for (sx = [-1, 1]) translate([sx * 19.4, -24]) { difference() { square(9, center = true); square(6, center = true); }
                                                       square([1.3, 9], center = true); square([9, 1.3], center = true); }
        traco([[0, 30], [0, 19.5]], 1.2); translate([0, 16.6]) coracao(7);
    }
    else if (d == "bengala")
        for (i = [-10 : 10]) traco([[-40, i * 8.5 - 40], [40, i * 8.5 + 40]], 1.4);
    else if (d == "estrela") {
        difference() { offset(r = -5.2) forma(d); offset(r = -6.6) forma(d); }
        for (i = [0 : 4]) let(a = 90 + 72 * i) traco([24 * dir(a), 36 * dir(a)], 1.5);
    }
    else if (d == "gorro") {
        difference() { gorro_banda(); offset(r = -2) gorro_banda(); }
        difference() { pompom([26, 23], 6.5); offset(r = -2) pompom([26, 23], 6.5); }
        traco(bez2([-30, -4], [-6, 6], [20, -6], 14), 1.4);
        traco(bez2([-26, 8], [-6, 16], [16, 8], 14), 1.4);
    }
    else if (d == "meia") {
        difference() { ret(-24, 16, 20, 36, 4); offset(r = -2) ret(-24, 16, 20, 36, 4); }
        traco(bez2([-22, -14], [-9, -18], [-8, -38], 12), 1.5);
        traco(bez2([22, -12], [17, -24], [24, -38], 12), 1.5);
        translate([-3, 0]) rotate(90) floco(14.6, 1.7);
    }
    else if (d == "presente") {
        difference() { ret(-31, 4, 31, 15, 2.5); offset(r = -2) ret(-31, 4, 31, 15, 2.5); }
        for (sx = [-4, 4]) traco([[sx, -40], [sx, 18]], 1.5);
    }
}

module extras_forma(d) {                       // partes fora da silhueta (não recortadas)
    if (d == "sino_f") { translate([0, -32.2]) circle(4.2); ret(-3.5, 29, 3.5, 36.5, 1.2); }
    else if (d == "casa") traco(cr([[17, 29], [19.5, 32.5], [16.5, 35.5], [19.5, 39], [23, 40.2]], 6), 1.7, 1.0);
    else if (d == "gorro") pompom([26, 23], 6.5);
    else if (d == "presente") { translate([0, 19]) scale(0.9) laco(); ret(-1.8, 18, 1.8, 26, 0.6); }
    else if (d == "boneco") {
        difference() {
            translate([0, 14.5]) circle(12.5);
            for (sx = [-1, 1]) translate([sx * 4.2, 17.5]) circle(1.5);
            for (a = [-40 : 20 : 40]) translate([0, 15] + 6.2 * dir(270 + a)) circle(0.85);
            polygon([[0.2, 14.6], [8.5, 13.4], [0.2, 12.4]]);
        }
        ret(-13, 26, 13, 29.4, 1); ret(-9, 28, 9, 37, 1.2);                         // chapéu
        difference() { ret(-14, 3.6, 14, 8.2, 2); }                                   // cachecol
        traco([[8, 6], [11, -6]], 4.2, 3.6);
        for (sx = [-1, 1]) {
            traco([[sx * 19, -3], [sx * 28, 4], [sx * 34, 9]], 1.8, 1.3);              // braços
            traco([[sx * 28, 4], [sx * 30, 10]], 1.4, 1.1);
        }
    }
}

function argola(d) =
    d == "sino_f" ? [0, 39.5] : d == "casa" ? [0, 34.5] : d == "bengala" ? [0, 41.5] : d == "estrela" ? [0, 38.5] :
    d == "gorro" ? [26, 32.6] : d == "meia" ? [-20, 39.5] : d == "presente" ? [0, 29.5] : d == "boneco" ? [0, 40.5] :
    [0, argola_y(d)];

module cena(d) {
    if (FORMA) cena_forma(d);
    else
    if (d == "montanhas") {
        K = [[-40, 9], [-31, 14], [-23, 22.5], [-17, 18], [-12, 15.5], [-5.5, 23.5], [1, 30.5],
             [7, 24], [12, 18], [17, 21.5], [22.5, 25], [29, 17.5], [40, 10]];
        picos = [[-23, 22.5], [1, 30.5], [22.5, 25]];
        difference() {
            union() {
                difference() { serra(K); offset(r = -2.5) serra(K); }
                for (pk = picos) intersection() { serra(K); translate(pk) scale([1, 0.62]) circle(11.5); }
            }
            for (pk = picos) intersection() {          // linha de neve ondulada
                offset(r = -1.3) intersection() { serra(K); translate(pk) scale([1, 0.62]) circle(11.5); }
                translate(pk) traco(cr([[-11, -7.4], [-6, -4.4], [-3, -6], [0.5, -3.6], [4, -5.6], [7.5, -4.2], [11, -7.4]], 5), 1.0);
            }
        }
        translate([-15.5, 26.9]) difference() { circle(4.8); translate([2.1, -1.1]) circle(4.0); }   // lua
        chao([[-40, -23], [-30, -26.5], [-19, -28.5], [-9, -30.5], [0, -31.5], [9, -30.2], [19, -28], [30, -25.5], [40, -22.5]]);
        for (t = [[-26.5, -26, 22, 15], [-15, -29.5, 16, 11.5], [-5.5, -31.5, 10.5, 8], [5.8, -30.8, 13.5, 9.8],
                  [16.8, -28.6, 18, 12.6], [27, -23, 21.5, 14]])
            translate([t[0], t[1]]) pinheiro(t[2], t[3], t[2] > 15 ? 4 : 3);
    }
    else if (d == "azevinho") {
        ramo_pinho([[-36, 1], [-30.5, 10], [-24, 17], [-16.5, 22.6], [-8, 26.2], [1, 28]], 6.2, 2);
        translate([-17.5, 20.2]) sino();
        for (s = [-1, 1]) translate([-17.5, 21.6]) rotate(90 + s * 64) folha_azevinho(10, 4.8, -s * 0.1);
        bagas([-19.2, 21.2], 1.5);
        traco(cr([[21, 31.6], [20.4, 26], [21, 20.5]], 5), 1.2);
        translate([21, 16.5]) estrela_guia(8.5);
        colina([[-40, -2], [-30, -9.5], [-20, -17.5], [-10, -23], [0, -26.2], [12, -28.6], [26, -29.6], [40, -29]]);
        chao([[-40, -33], [-20, -32.6], [-5, -31.2], [8, -31.8], [22, -31], [40, -29.6]]);
        translate([-22, -16.5]) pinheiro(17, 12);
        translate([-12, -22]) pinheiro(12.5, 9.2, 3);
        raminho(-28, -8);
    }
    else if (d == "laco") {
        ramo_pinho([[-36, 2], [-31.5, 9.5], [-26.5, 15], [-21, 19.2], [-15, 22.4]], 6, 2);
        bagas([-28.6, 13.6], 1.5);
        traco(cr([[11.5, 33.5], [11.2, 25], [11.5, 17.5]], 4), 1.2);  translate([11.5, 15.8]) coracao(8);
        traco(cr([[21.5, 29], [21.8, 20], [21.5, 14]], 4), 1.2);     translate([21.5, 10.5]) bola_mini(3.4);
        translate([13.5, -22]) rotate(-8) poinsetia();
        raminho(-22, 8, 28.5);
        espiral_folhas([-15.6, -21], 7.4, 1.25, 205, -1);
    }
    else if (d == "coroa") {
        R = 29.6;
        traco(arco(R, -74, 254, 120), 1.4);
        for (i = [0 : 24]) let(a = -68 + i * 12.95, sg = i % 2 == 0 ? 1 : -1, t = a + 90)
            translate(R * dir(a)) rotate(t - sg * 34) folha_c(7.4, 3.0, sg * 0.16);
        for (a = [-32, 32, 96, 148, 212]) translate((R - 0.2) * dir(a + 6)) circle(1.3);
        translate([0, -31.6]) scale(0.6) laco();
    }
    else if (d == "lua") {
        for (e = [[6, 19.5, 0], [14, 12.5, 1], [22, 20.5, 2]]) {
            traco([[e[0], 36], [e[0], e[1]]], 1.25);
            translate([e[0], e[1]]) if (e[2] == 1) brilho(5, 3.2); else estrela_curva(e[2] == 0 ? 4.2 : 3.3);
        }
    }
    else if (d == "floco") {
        for (a = [0 : 60 : 300]) rotate(a) {
            traco([[4.6, 0], [RI + 1, 0]], 1.7, 1.4);
            for (f = [[11, 7], [19.5, 6], [27, 4]]) for (sg = [-1, 1])
                traco([[f[0], 0], [f[0] + f[1] * cos(48), sg * f[1] * sin(48)]], 1.35, 1.0);
            translate([31.5, 0]) rotate(45) arredondar(0.3) square(2.2, center = true);
        }
        laco_fechado([for (i = [0 : 5]) 5.2 * dir(30 + i * 60)], 1.5);
    }
    else if (d == "linha") {
        A = [0, 25]; E = [-19.5, -23]; D = [19.5, -23];          // árvore em traço: contorno + grinaldas
        lado = function(t, P) A + (P - A) * t;
        laco_fechado([A, D, E], 1.6);
        for (g = [[0.32, 0.4, 2.6], [0.58, 0.66, 3.2], [0.84, 0.9, 3.6]])
            let(p0 = lado(g[0], E), p1 = lado(g[1], D), m = (p0 + p1) / 2 - [0, g[2]])
                traco(bez2(p0, m, p1, 14), 1.3);
        for (b = [[0.32, 0.4, 2.6, 0.5], [0.58, 0.66, 3.2, 0.3], [0.58, 0.66, 3.2, 0.72], [0.84, 0.9, 3.6, 0.5]])
            let(p0 = lado(b[0], E), p1 = lado(b[1], D), m = (p0 + p1) / 2 - [0, b[2]], t = b[3],
                q = pow(1 - t, 2) * p0 + 2 * (1 - t) * t * m + t * t * p1)
                translate(q - [0, 1.9]) circle(1.55);
        traco([[0, -23], [0, -36]], 1.8);
        translate([0, 28.2]) estrela_curva(4.6);
        traco([[0, 30], [0, 36]], 1.2);
    }
    else if (d == "rena") {
        ramo_folhas([[-36, -3], [-32, 5], [-27, 12], [-21, 18], [-14.5, 23], [-8, 26.6]], 8.5, 3.0);
        for (p = [[-27.5, 17.6], [-19.6, 25.2]]) bagas(p, 1.5);
        traco(cr([[19.5, 32], [19.2, 27], [19.5, 22.5]], 4), 1.2);
        translate([19.5, 19.5]) estrela_guia(8.5);
        translate([0, 30.4]) floco(5.2);
        chao([[-40, -25.5], [-25, -28.2], [-10, -30], [0, -30.6], [10, -30], [25, -28.2], [40, -25.5]]);
        translate([-1.5, -30]) rena();
        for (t = [[-19.2, -28.4, 18, 12.6], [-27.8, -20.6, 13, 9.2], [18.6, -28.6, 16.5, 11.5], [27.4, -21.5, 12.5, 8.6]])
            translate([t[0], t[1]]) pinheiro(t[2], t[3], t[2] > 14 ? 4 : 3);
    }
}

// Centro da argola de suspensão por design
function argola_y(d) = d == "laco" ? 45.5 : 44.5;
// [y do nome, altura máx. do corpo das letras] (espaço 75 mm)
// [y nome, corpo máx., cx, cy, raio interior, largura mínima do nome que já toca na decoração (0 = nunca)]
function cfg(d) =
    d == "montanhas" ? [  2,   20, 0, 0, RI, 0] :
    d == "azevinho"  ? [ -1,   20, 0, 0, RI, 0] :
    d == "laco"      ? [  1,   20, 0, 0, RI, 0] :
    d == "rena"      ? [  4.5, 18, 0, 0, RI, 0] :
    d == "coroa"     ? [  0,   19, 0, 0, RI, 58] :
    d == "lua"       ? [ -2,   18, LUA_C[0], LUA_C[1], LUA_R, 0] :
    d == "floco"     ? [  0,   18, 0, 0, RI, 14] :
    d == "linha"     ? [ -6,   17, 0, 0, RI, 32] :
    // importados: cy = y do nome → a largura do nome = 2 × raio (medido no contorno real)
    d == "lev_montanhas" ? [  0, 19, 0,    0,  34.66, 0] :
    d == "lev_rena"      ? [  5, 17, 5.82, 5,  28.26, 0] :
    d == "lev_laco"      ? [  0, 18, 4.72, 0,  29.41, 0] :
    d == "lev_sino"      ? [ -1, 18, 4.96, -1, 29.77, 0] :
    d == "lev_pata"      ? [-13, 13, 0,  -13,  20.6,  0] :
    // formas: [y nome, corpo, cx, cy (= y nome), meia largura interior, largura mín., rotação]
    d == "sino_f"   ? [ -5,  13,  0,  -5,  21.9, 0] :
    d == "casa"     ? [ -9,  13,  0,  -9,  23.6, 0] :
    d == "bengala"  ? [-10, 11.5, 16, -10, 22,   1, 90] :
    d == "estrela"  ? [  0,  13,  0,   0,  22.3, 0] :
    d == "gorro"    ? [-24,  12,  0, -24,  27.5, 0] :
    d == "meia"     ? [ 26,  10.5, -2,  26,  19.6, 0] :
    d == "presente" ? [-14,  13,  0, -14,  24.6, 12] :
    /* boneco */      [-15,  13,  0, -15,  19.6, 0];

module importada(d) {
    if (d == "lev_montanhas") lev_montanhas();
    else if (d == "lev_rena") lev_rena();
    else if (d == "lev_laco") lev_laco();
    else if (d == "lev_sino") lev_sino();
    else if (d == "lev_pata") lev_pata();
}

module moldura(d) {
    if (FORMA) difference() { forma(d); offset(r = -PF) forma(d); }
    else if (d == "lua")
        difference() {
            circle(r = RO, $fn = 160);
            translate(LUA_C) circle(r = LUA_R, $fn = 160);
            for (b = [[-24, -16, 3.4], [-15.5, -27, 2.4], [-31.5, -7.5, 2]]) translate([b[0], b[1]]) brilho(b[2]);
        }
    else difference() { circle(r = RO, $fn = 160); circle(r = RI, $fn = 160); }
}
module interior(d) {
    if (FORMA) offset(r = -PF + 1.2) forma(d);
    else if (d == "lua") translate(LUA_C) circle(r = LUA_R + 1.5, $fn = 160);
    else circle(r = RI + 1.5, $fn = 160);
}

module suporte(d) {                           // tampa/laço + argola
    if (FORMA) { extras_forma(d); translate(argola(d)) circle(d = 9.5); }
    else if (d == "laco") {
        translate([0, 35.5]) laco();
        translate([0, 40]) square([3.6, 5], center = true);
    } else {
        translate([0, 37.3]) polygon(cr([[-6.5, -3], [-6.5, 1.6], [-5, 3], [5, 3], [6.5, 1.6], [6.5, -3]], 4));
    }
    if (!FORMA) translate([0, argola_y(d)]) circle(d = 9.5);
}

// ---------------------------------------------------------------------
// Nome
// ---------------------------------------------------------------------
// medidas por fonte (fração do size): [largura/carácter, altura corpo, descendente, letras que descem]
function fm(f) =   // [largura/carácter, corpo, descendente, letras que descem] (medido por fonte)
    f == "Pacifico"    ? [0.685, 1.25, 0.63, "fgjpqyGQYçÇ"]   :
    f == "Lobster"     ? [0.610, 1.05, 0.35, "fgjpqyGJLçÇ"]   :
    f == "Grand Hotel" ? [0.506, 1.00, 0.55, "fgjpqyzGJYZçÇ"] :
    f == "Damion"      ? [0.606, 1.00, 0.40, "fgjpqyzQçÇ"]    :
    f == "Cookie"      ? [0.493, 0.90, 0.45, "fgjpqyJYçÇ"]    :
    f == "Norican"     ? [0.627, 1.05, 0.35, "fgjpqyzGJQYçÇ"] :
    f == "Yellowtail"  ? [0.562, 1.00, 0.42, "fgjpqyGJYçÇ"]   :
    f == "Satisfy"     ? [0.600, 1.27, 0.40, "fgjpqyzçÇ"]     :
    f == "Dancing Script Bold" ? [0.580, 1.12, 0.27, "fgjpqyzZçÇ"] : [0.6, 1.1, 0.5, "fgjpqy"];
M     = fm(fonte);
desce = len([for (c = nome) if (len(search(c, M[3])) > 0) 1]) > 0;
d_r   = desce ? M[2] : 0;                                   // descendente / size
C     = cfg(design);                                         // [y, corpo máx., cx, cy, raio interior]
yn    = C[0] * k;
Hcorpo = C[1] * k;                                           // altura máx. do corpo das letras
cxn   = C[2] * k;                                            // centro do espaço interior
cyn   = C[3] * k;
Rin   = C[4] * k;
Hmax  = Hcorpo * (M[1] + d_r) / M[1];                       // altura máx. total (com descendentes)
W     = 2 * sqrt(pow(Rin, 2) - pow(yn - cyn, 2)) + 3 * k;   // encosta e entra 1,5 mm na moldura
w_est = M[0] * len(nome);                                    // largura / size
h_w   = W * (M[1] + d_r) / w_est;                            // altura total se ajustado à largura
curto = h_w > Hmax;                                          // nome curto → limitado em altura
h_fin = curto ? Hmax : h_w;
y_txt = yn - h_fin * d_r / (M[1] + d_r) / 2;                 // centra o corpo (não a caixa) em yn
rot   = len(C) > 6 ? C[6] : 0;                               // rotação do nome (bengala: 90°)
dy    = y_txt - yn;                                          // deslocamento do texto no referencial do nome
module no_nome() translate([cxn, yn]) rotate(rot) children();
module envolvente() { if (FORMA) scale(k) offset(r = 0.05) forma(design); else circle(r = RO * k - 0.05); }

// "Dancing Script Bold" é um alias: o ":" não pode ir no menu do Customizer (separa valor:rótulo)
FONTE_REAL = fonte == "Dancing Script Bold" ? "Dancing Script:style=Bold" : fonte;
module nome_raw() text(nome, size = 10, font = FONTE_REAL, halign = "center", valign = "center");
module nome_fit() {
    if (!curto) resize([W, 0], auto = true) nome_raw();
    else        resize([0, Hmax], auto = true) nome_raw();
}

module nome_base2d() {
    g = uniao_letras * max(1, h_fin / 18);
    intersection() {
        envolvente();
        no_nome() {
            translate([0, dy]) offset(r = contorno_nome - g) offset(r = g) nome_fit();
            // nomes curtos: linha de apoio junto à base das letras, de lado a lado do aro
            if (curto && (C[5] == 0 || 0.85 * Hmax * w_est / (M[1] + d_r) < C[5] * k)) let(yb = dy - h_fin / 2 + h_fin * d_r / (M[1] + d_r) + 0.12 * Hcorpo)
                for (m = [0, 1]) mirror([m, 0]) let(R = Rin + 2.5 * k)  // floreado ondulado
                    traco(cr([[-R, yb + 2.2], [-0.75 * R, yb - 0.6], [-0.45 * R, yb + 0.9],
                              [-0.15 * R, yb - 0.5], [0.02, yb]], 6), 2.6, 1.9);
        }
    }
}
module nome_topo2d()
    intersection() {
        translate([cxn, cyn]) circle(r = Rin + 1.5 * k);
        no_nome() translate([0, dy]) offset(delta = offset_nome) nome_fit();
    }

// ---------------------------------------------------------------------
module base2d()
    difference() {
        union() {
            if (IMPORT) scale(k) importada(design);
            else scale(k) suavizar(0.4) {
                moldura(design);
                intersection() { interior(design); cena(design); }
                suporte(design);
            }
            nome_base2d();
        }
        if (!IMPORT) translate(argola(design) * k) circle(d = 4.6 * k);
    }

module base3d() linear_extrude(altura_ornamento) base2d();
module nome3d() translate([0, 0, altura_ornamento - 0.01]) linear_extrude(altura_nome + 0.01) nome_topo2d();

if (parte == "base2d")      base2d();
else if (parte == "nome2d") nome_topo2d();
else if (parte == "base")   base3d();
else if (parte == "nome")   nome3d();
else { color(cor_base) base3d(); color(cor_nome) nome3d(); }
`;
