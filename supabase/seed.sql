-- =============================================
-- SEED DATA — App Corpo e Saúde
-- Exercícios iniciais para a biblioteca
-- =============================================

-- PEITO
INSERT INTO public.exercises (name, primary_muscle, secondary_muscles, equipment, level, instructions, tips, is_popular) VALUES
('Supino Reto com Barra', 'peito', '{"triceps","ombros"}', 'Barra e banco', 'iniciante',
 '{"Deite no banco com os pés apoiados no chão","Segure a barra com pegada um pouco mais larga que os ombros","Desça a barra controladamente até o peito","Empurre a barra para cima até estender os braços"}',
 '{"Mantenha as escápulas retraídas","Não levante os glúteos do banco"}', true),

('Supino Inclinado com Halteres', 'peito', '{"triceps","ombros"}', 'Halteres e banco inclinado', 'intermediario',
 '{"Ajuste o banco a 30-45 graus","Segure os halteres na altura do peito","Empurre os halteres para cima","Desça controladamente"}',
 '{"Foque na contração do peitoral superior"}', true),

('Crucifixo com Halteres', 'peito', '{"ombros"}', 'Halteres e banco', 'iniciante',
 '{"Deite no banco segurando os halteres acima do peito","Abra os braços em arco até sentir alongamento","Retorne à posição inicial contraindo o peitoral"}',
 '{"Mantenha leve flexão nos cotovelos","Não use peso excessivo"}', true),

('Crossover', 'peito', '{"ombros"}', 'Cabo/Polia', 'intermediario',
 '{"Posicione-se entre as polias com pegada alta","Puxe os cabos para baixo e à frente","Cruze as mãos na frente do corpo","Retorne controladamente"}',
 '{"Mantenha o tronco levemente inclinado"}', true),

('Flexão de Braço', 'peito', '{"triceps","ombros","abdomen"}', 'Peso corporal', 'iniciante',
 '{"Apoie as mãos no chão na largura dos ombros","Desça o corpo até o peito quase tocar o chão","Empurre de volta à posição inicial"}',
 '{"Mantenha o corpo reto como uma tábua"}', true),

-- COSTAS
('Puxada Frontal', 'costas', '{"biceps"}', 'Máquina de puxada', 'iniciante',
 '{"Sente na máquina e ajuste o apoio de joelhos","Segure a barra com pegada aberta","Puxe a barra até a altura do queixo","Retorne controladamente"}',
 '{"Puxe com as costas, não com os braços"}', true),

('Remada Curvada com Barra', 'costas', '{"biceps","ombros"}', 'Barra', 'intermediario',
 '{"Incline o tronco a 45 graus","Segure a barra com pegada pronada","Puxe a barra até o abdômen","Desça controladamente"}',
 '{"Mantenha as costas retas"}', true),

('Remada Unilateral com Halter', 'costas', '{"biceps"}', 'Halter e banco', 'iniciante',
 '{"Apoie o joelho e mão no banco","Segure o halter com o braço livre","Puxe o halter até a cintura","Desça controladamente"}',
 '{"Mantenha o tronco paralelo ao chão"}', true),

('Pulley Frente', 'costas', '{"biceps"}', 'Máquina pulley', 'iniciante',
 '{"Sente com os joelhos levemente flexionados","Puxe a barra até o peito","Retorne à posição inicial"}',
 '{"Mantenha o tronco ereto"}', false),

-- OMBROS
('Desenvolvimento com Halteres', 'ombros', '{"triceps"}', 'Halteres', 'iniciante',
 '{"Sente com os halteres na altura dos ombros","Empurre os halteres para cima","Desça controladamente até a posição inicial"}',
 '{"Não trave os cotovelos totalmente no topo"}', true),

('Elevação Lateral', 'ombros', '{}', 'Halteres', 'iniciante',
 '{"Em pé, segure os halteres ao lado do corpo","Eleve os braços lateralmente até a altura dos ombros","Desça controladamente"}',
 '{"Mantenha leve flexão nos cotovelos","Não use impulso do corpo"}', true),

('Elevação Frontal', 'ombros', '{}', 'Halteres', 'iniciante',
 '{"Em pé, segure os halteres à frente das coxas","Eleve um braço de cada vez até a altura dos ombros","Desça controladamente"}',
 '{"Alterne os braços ou faça simultâneo"}', false),

-- BÍCEPS
('Rosca Direta com Barra', 'biceps', '{}', 'Barra reta', 'iniciante',
 '{"Em pé, segure a barra com pegada supinada","Flexione os cotovelos até contrair totalmente","Desça controladamente"}',
 '{"Mantenha os cotovelos fixos ao lado do corpo"}', true),

('Rosca Alternada com Halteres', 'biceps', '{}', 'Halteres', 'iniciante',
 '{"Em pé, segure os halteres com pegada neutra","Flexione alternando os braços com rotação","Desça controladamente"}',
 '{"Supine o punho durante a subida"}', true),

('Rosca Martelo', 'biceps', '{"antebracos"}', 'Halteres', 'iniciante',
 '{"Segure os halteres com pegada neutra (martelo)","Flexione os cotovelos sem rotação","Desça controladamente"}',
 '{"Ótimo para braquial e antebraço"}', false),

-- TRÍCEPS
('Tríceps Corda', 'triceps', '{}', 'Cabo/Polia', 'iniciante',
 '{"Segure a corda na polia alta","Estenda os braços para baixo abrindo a corda","Retorne controladamente"}',
 '{"Mantenha os cotovelos fixos ao lado do corpo"}', true),

('Tríceps Testa com Barra', 'triceps', '{}', 'Barra EZ', 'intermediario',
 '{"Deite no banco segurando a barra acima do rosto","Flexione os cotovelos descendo a barra até a testa","Estenda os braços de volta"}',
 '{"Use peso moderado para segurança"}', true),

('Mergulho no Banco', 'triceps', '{"peito","ombros"}', 'Banco', 'iniciante',
 '{"Apoie as mãos no banco atrás de você","Flexione os cotovelos descendo o corpo","Empurre de volta à posição inicial"}',
 '{"Mantenha os cotovelos apontando para trás"}', false),

-- QUADRÍCEPS
('Agachamento Livre', 'quadriceps', '{"gluteos","posteriores"}', 'Barra e rack', 'intermediario',
 '{"Posicione a barra nos trapézios","Agache até as coxas ficarem paralelas ao chão","Empurre de volta à posição inicial"}',
 '{"Mantenha os joelhos alinhados com os pés","Não arredonde as costas"}', true),

('Leg Press 45°', 'quadriceps', '{"gluteos"}', 'Máquina leg press', 'iniciante',
 '{"Sente na máquina com os pés na plataforma","Flexione os joelhos até 90 graus","Empurre a plataforma de volta"}',
 '{"Não trave os joelhos no topo"}', true),

('Cadeira Extensora', 'quadriceps', '{}', 'Máquina extensora', 'iniciante',
 '{"Sente na máquina e ajuste o apoio","Estenda os joelhos até a contração total","Desça controladamente"}',
 '{"Foque na contração do quadríceps"}', true),

-- GLÚTEOS
('Hip Thrust', 'gluteos', '{"posteriores"}', 'Barra e banco', 'intermediario',
 '{"Apoie as costas superiores no banco","Posicione a barra sobre o quadril","Empurre o quadril para cima","Desça controladamente"}',
 '{"Contraia forte os glúteos no topo"}', true),

('Afundo com Halteres', 'gluteos', '{"quadriceps"}', 'Halteres', 'iniciante',
 '{"Dê um passo à frente com uma perna","Flexione ambos os joelhos a 90 graus","Empurre de volta à posição inicial"}',
 '{"Mantenha o tronco ereto"}', true),

-- POSTERIORES
('Mesa Flexora', 'posteriores', '{}', 'Máquina flexora', 'iniciante',
 '{"Deite de bruços na máquina","Flexione os joelhos trazendo o apoio em direção aos glúteos","Desça controladamente"}',
 '{"Não levante o quadril do apoio"}', true),

('Stiff com Barra', 'posteriores', '{"gluteos","costas"}', 'Barra', 'intermediario',
 '{"Em pé, segure a barra à frente","Incline o tronco mantendo as pernas quase estendidas","Retorne à posição ereta"}',
 '{"Mantenha as costas retas durante todo o movimento"}', true),

-- ABDÔMEN
('Prancha Frontal', 'abdomen', '{}', 'Peso corporal', 'iniciante',
 '{"Apoie os antebraços e pontas dos pés no chão","Mantenha o corpo reto como uma tábua","Segure a posição pelo tempo determinado"}',
 '{"Não deixe o quadril cair ou subir demais"}', true),

('Abdominal Crunch', 'abdomen', '{}', 'Peso corporal', 'iniciante',
 '{"Deite com os joelhos flexionados","Eleve os ombros do chão contraindo o abdômen","Desça controladamente"}',
 '{"Não puxe o pescoço com as mãos"}', true),

('Elevação de Pernas', 'abdomen', '{}', 'Barra fixa ou banco', 'intermediario',
 '{"Pendure-se na barra ou deite no banco","Eleve as pernas até 90 graus","Desça controladamente"}',
 '{"Evite usar impulso"}', false),

-- PANTURRILHAS
('Panturrilha em Pé', 'panturrilhas', '{}', 'Máquina ou step', 'iniciante',
 '{"Posicione-se com as pontas dos pés no apoio","Eleve os calcanhares o máximo possível","Desça controladamente além da linha do apoio"}',
 '{"Faça a amplitude completa do movimento"}', true),

('Panturrilha Sentado', 'panturrilhas', '{}', 'Máquina sentado', 'iniciante',
 '{"Sente na máquina com os joelhos sob o apoio","Eleve os calcanhares","Desça controladamente"}',
 '{"Foca no sóleo (parte interna da panturrilha)"}', false);
