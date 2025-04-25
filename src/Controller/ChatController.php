<?php

namespace App\Controller;

use Lcobucci\JWT\Configuration;
use Symfony\Component\HttpFoundation\Cookie;
use App\Entity\Message;
use App\Entity\Room;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class ChatController extends AbstractController
{
    #[Route('/chat/{roomId<\d+>}', name: 'chat_private', methods: ['GET'])]
    public function privateChat(
        int $roomId,
        Request $request,
        EntityManagerInterface $entityManager
    ): Response {
        // Génération du JWT Mercure
        $config = Configuration::forSymmetricSigner(
            new \Lcobucci\JWT\Signer\Hmac\Sha256(),
            \Lcobucci\JWT\Signer\Key\InMemory::plainText($_ENV['MERCURE_JWT_SECRET'])
        );

        $now = new \DateTimeImmutable();
        $token = $config->builder()
            ->issuedBy('your-app')
            ->issuedAt($now)
            ->withClaim('mercure', ['subscribe' => ["/chat/{$roomId}"]])
            ->getToken($config->signer(), $config->signingKey());

        $jwt = $token->toString();

        $messages = $entityManager->getRepository(Message::class)
            ->findBy(['roomId' => $roomId], ['timestamp' => 'ASC']);
        
        $mercurePublicUrl = $_ENV['MERCURE_PUBLIC_URL'] ?? $_SERVER['MERCURE_PUBLIC_URL'] ?? '';

        $response = $this->render('chat/index.html.twig', [
            'messages' => $messages,
            'roomId' => $roomId,
            'mercure_public_url' => $mercurePublicUrl,
        ]);

        $response->headers->setCookie(
            Cookie::create('mercureAuthorization', $jwt)
                ->withHttpOnly(true)
                ->withPath('/.well-known/mercure')
        );
        return $response;
    }

    #[Route('/chat/new', name: 'chat_new', methods: ['GET', 'POST'])]
public function newRoom(Request $request, EntityManagerInterface $entityManager): Response
{
    // Exemple simple : création d'une room sans formulaire
    $room = new Room();
    $room->setName('Conversation privée ' . uniqid());
    $entityManager->persist($room);
    $entityManager->flush();

    // Redirige vers la page du chat privé avec le nouvel id
    return $this->redirectToRoute('chat_private', ['roomId' => $room->getId
()]);
}

    #[Route('/chat/send/{roomId}', name: 'chat_send', methods: ['POST'])]
    public function send(
        int $roomId,
        Request $request,
        EntityManagerInterface $entityManager,
        HubInterface $hub
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $message = new Message();
        $message->setContent($data['content']);
        $message->setSender($data['sender']);
        $message->setTimestamp(new \DateTime());
        $message->setRoomId($roomId);

        $entityManager->persist($message);
        $entityManager->flush();

        // Publie sur le topic privé Mercure
        $update = new Update(
            "/chat/{$roomId}",
            json_encode([
                'id' => $message->getId(),
                'content' => $message->getContent(),
                'sender' => $message->getSender(),
                'timestamp' => $message->getTimestamp()->format('Y-m-d H:i:s')
            ]),
            true // privé
        );

        $hub->publish($update);

        return $this->json([
            'status' => 'success',
            'message' => 'Message sent successfully'
        ]);
    }
}